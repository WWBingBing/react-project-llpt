import moment from 'moment'


export const getFilterValue = (field) =>{
    let filter = ['ctype','label','config'],data = {};
    Object.keys(field).filter((key)=>filter.indexOf(key)==-1).forEach((key)=>{
        data[key] = field[key];
    });
    return data;
};


export const timeTran=(time)=>{
    if(!time) return false;
    return moment(time).format('YYYY-MM-DD')
}
export const timeTranAll=(time)=>{
    if(!time) return false;
    return moment(time).format('YYYY-MM-DD HH:MM:SS')
}


const chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
const chnUnitChar = ["","十","百","千"];


export const SectionToChinese=(section)=>{
    let strIns = '', chnStr = '';
    let unitPos = 0;
    let zero = true;
    while(section > 0){
        let v = section % 10;
        if(v === 0){
            if(!zero){
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        }else{
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    return chnStr;
}