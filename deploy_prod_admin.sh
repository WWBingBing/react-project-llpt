#!/bin/bash

source /etc/profile
#WORKSPACE=/var/lib/jenkins/workspace
#SRC_DIR=${WORKSPACE}/test_llpt_admin
#echo $1 | $2 | $3 | $4 | $5 | $6
#/var/lib/jenkins/workspace/test_llpt_admin | compiling | develop | llptapp-admin | REACT
SRC_DIR=$1
BUILD_MODE=$2
BRANCH=$3
PROJECT_NAME=$4
MACHINE=$5

if [[ $# -lt 1 ]];then
	    echo -e usage: "$0 srcDir [compiling|compiling_and_deploy|deploy]  [develop|master|..]  [llptapp-admin|llptapp-bos|..]  [deployIP|..]\n"
	    echo -e eg. "$0 /var/lib/jenkins/workspace/prod_llpt_admin  compiling  master  llptapp-admin  REACT\n"
        exit -1
fi
if [[ -z "${SRC_DIR}" ]];then
	echo SRC_DIR:${SRC_DIR}
	exit -1
fi

#不指定则默认只编译
if [[ -z "${BUILD_MODE}" ]];then
	BUILD_MODE=compiling
fi
#默认发布develop分支,线上只发布master分支
if [[ -z "${BRANCH}" ]];then
	BRANCH=master
fi
#项目暂时主要提供admin服务,默认发布admin
if [[ -z "${PROJECT_NAME}" ]];then
	PROJECT_NAME=llptapp-admin
fi

#从配置文件中获取对应服务器的ip地址
#MACHINE=$(awk -F '=' '/\[main\]/{a=1}a==1&&$1~/'${MACHINE}'/{print $2;exit}' ${SRC_DIR}/conf.ini)
#if [[ -z "${MACHINE}" ]];then
#	#MACHINE=172.16.210.61
#	echo "MACHINE can not be empty..."
#	exit 1
#fi

#nginx中root,比如 /home/www/huhuwallet/admin中的admin即为alias_name
if [[ "${PROJECT_NAME}" =~ "llptapp-" ]];then
    ALIAS_NAME=${PROJECT_NAME/llptapp-/}
    if [[ -z "${ALIAS_NAME}" ]];then
			echo "PROJECT_NAME:${PROJECT_NAME} and ALIAS_NAME:${ALIAS_NAME}"
			exit -1
   	fi
fi

#nginx中的root
ROOT_DIR=/home/www/llpt
DEP_DIR=/home/deploy/llpt
STATIC_PATH=dist
#为war包添加发布时间,方便查看发布时间或者回滚时有据可查
TIME_STR=$(date "+%Y-%m-%d_%H-%M-%S")
#为项目保留的历史版本,方便回滚
SAVE_DEP=5

echo $0 $SRC_DIR $BUILD_MODE $BRANCH $PROJECT_NAME $MACHINE with DEP_DIR:$DEP_DIR

#1 切换到指定分支,拉取最新代码
cd $SRC_DIR
git checkout -f $BRANCH && git pull
if [[ $? -ne 0 ]];then
    echo "git pull failed..."
    exit -1
fi

#2 build模式是需要编译的才编译
if [ "compiling" == "${BUILD_MODE}" -o "compiling_and_deploy" == "${BUILD_MODE}" ];then
    cnpm install
    if [[ $? != 0 ]];then
        echo npm run install error!!!!!!
        exit -2
    fi
    mv ${SRC_DIR}/${STATIC_PATH} ${SRC_DIR}/${STATIC_PATH}_old
    cnpm run build
    if [[ $? != 0 ]];then
        echo npm run build error!!!!!!
	    mv ${SRC_DIR}/${STATIC_PATH}_old ${SRC_DIR}/${STATIC_PATH}
        exit -3
    fi
    rm -rf ${SRC_DIR}/${STATIC_PATH}_old
fi

if [[ "compiling" == "${BUILD_MODE}" ]];then
	echo "build success"
	exit 0
fi

#3 发布(这里每次发布使用全部新的静态包,而不管是否只是更新了部分静态文件,这样更容易做版本回退管理)
if [[ "${BUILD_MODE}" =~ "deploy" ]];then
	if [[ -d "${SRC_DIR}/${STATIC_PATH}" ]];then
		echo "scp -r ${SRC_DIR}/${STATIC_PATH}/ to ${MACHINE}"
		ssh ${MACHINE} 'mkdir -p '${DEP_DIR}
		scp -qr ${SRC_DIR}/${STATIC_PATH} ${MACHINE}:${DEP_DIR}/${PROJECT_NAME}-${TIME_STR}

		ssh ${MACHINE} \
				' source /etc/profile &&'\
				' mkdir -p '${ROOT_DIR}';'\
				' [ -L '${ROOT_DIR}'/'${ALIAS_NAME}' ] && rm -f '${ROOT_DIR}'/'${ALIAS_NAME}' ||'\
				' mv '${ROOT_DIR}'/'${ALIAS_NAME}' '${DEP_DIR}' ;'\
				' ln -s '${DEP_DIR}'/'${PROJECT_NAME}'-'${TIME_STR} ${ROOT_DIR}'/'${ALIAS_NAME}';'\
				' cd '${DEP_DIR}' &&'\
				' NUM=$(ls -lrt '${DEP_DIR}' | grep ^d | grep -v grep | grep '${PROJECT_NAME}' | wc -l) &&'\
				' echo find '${DEP_DIR}'/'${PROJECT_NAME}'xxxx-xx-xx $NUM;'\
				' for DEP_FILE in $(ls -lrt '${DEP_DIR}' | grep ^d | grep -v grep | grep '${PROJECT_NAME}' | tr -s " " | cut -d" " -f9); '\
				' do '\
					' [ $NUM -le '${SAVE_DEP}' ] && break; '\
					' [ -z "${DEP_FILE}" ] && break; '\
					' if [ "${DEP_FILE}" != "'${PROJECT_NAME}'-'${TIME_STR}'" ];then '\
						' echo rm -rf '${DEP_DIR}'/${DEP_FILE}  -- save $NUM dep files;'\
						' rm -rf '${DEP_DIR}'/${DEP_FILE} && '\
						' let NUM-=1; '\
					' fi; '\
				' done'
	else
		echo ${SRC_DIR}/${STATIC_PATH} not exists!!!
		exit -1
	fi
fi
