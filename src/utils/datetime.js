/**
 * 时间日期相关操作
 */


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format (datetime) {
  return formatWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator (datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    datetime = datetime.replace(/-/g,"/");
    const dateMat = new Date(datetime);
    //const dateMat = datetime;
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    const timeFormat = year + dateSeprator + (month<10?'0'+month:month) + dateSeprator + (day<10?'0'+day:day) + " " + (hh<10?'0'+hh:hh) + timeSeprator + (mm<10?'0'+mm:mm)  + timeSeprator + (ss<10?'0'+ss:ss) ;
    return timeFormat;
  }
}



export function myFunction (datetime){      
  var dateee = new Date(datetime).toJSON();
  var date = new Date(+new Date(dateee)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
  return date;
}