exports.install = function (Vue, options) {
  Vue.prototype.returnHourMin = function (time){
    let _time = new Date(time);
    let _hours = _time.getHours() >= 10 ? _time.getHours() : '0' + _time.getHours();
    let _mins = _time.getMinutes() >= 10 ? _time.getMinutes() : '0' + _time.getMinutes();
    return _hours + ':' + _mins;
  }
  Vue.prototype.returnDate = function (time){
    let _time = new Date(time);
    return _time.getDate();
  }
  Vue.prototype.returnMonth = function (time){
    let _time;
    if (time) {
      _time = new Date(time);
    }else {
      _time = new Date();
    }
    return _time.getMonth() + 1;
  }
  Vue.prototype.returnDate = function (time){
    let _time = new Date(time);//2018-07-27 09:00
    let _month = (_time.getMonth() + 1) >= 10 ? (_time.getMonth() + 1) : '0' + (_time.getMonth() + 1);
    let _day = _time.getDate() >= 10 ? _time.getDate() : '0' + _time.getDate();
    let _hours = _time.getHours() >= 10 ? _time.getHours() : '0' + _time.getHours();
    let _mins = _time.getMinutes() >= 10 ? _time.getMinutes() : '0' + _time.getMinutes();
    return _time.getFullYear() + '-' + _month + '-' + _day + ' ' + _hours + ':' + _mins
  }
  Vue.prototype.returnYmd = function (time){
    let _time = new Date(time);//2018-07-27
    let _month = (_time.getMonth() + 1) >= 10 ? (_time.getMonth() + 1) : '0' + (_time.getMonth() + 1);
    let _day = _time.getDate() >= 10 ? _time.getDate() : '0' + _time.getDate();
    return _time.getFullYear() + '-' + _month + '-' + _day
  }
  Vue.prototype.getLeftTime = function(time){//year,month,date
    let year = new Date(time).getFullYear();
    let month = new Date(time).getMonth() + 1;
    let date = new Date(time).getDate();
    //得出剩余时间
    let now=new Date();
    let endDate=new Date(time);
    let leftTime=endDate - now;
    let day = leftTime >= 0 ? parseInt(leftTime / 1000 / 60 / 60 / 24) : 0;
    let hour = leftTime >= 0 ? parseInt(leftTime / 1000 / 60 / 60 % 24) + (day*24) : 0;
    let minute = leftTime >= 0 ? parseInt(leftTime / 1000 / 60 % 60) : 0;
    let seconds = leftTime >= 0 ? parseInt(leftTime / 1000 % 60) : 0;
    return {
      'hours': hour,
      'minutes': minute,
      'second': seconds
    }
  }
}
