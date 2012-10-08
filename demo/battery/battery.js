var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;

var $body = $(document.body),
    $indicator = $('.indicator'),
    $surface = $('.indicator-surface'),
    $capacity = $('.indicator-capacity'),
    $level = $('.level'),
    $status = $('.status');

/* 转屏处理 */
function onResize(event) {
    var screen = window.screen,
        width = screen.availWidth,
        height = screen.availHeight,
        rotate = width > height;
    $body.toggleClass('rotate', rotate);
}
window.addEventListener('resize', onResize);
onResize();

/* 电池指示器 */
var capacityMinY = 78,
    capacityMaxY = 378;

function updateIndicator(level) {
    var capacityY = capacityMaxY - (capacityMaxY - capacityMinY) * level,
        surfaceY = capacityY - 26;
    // $capacity.css({'-webkit-mask-position': '0 ' + capacityY + 'px'});
    $capacity[0].style.cssText = '-webkit-mask-position:0 ' + capacityY + 'px';
    $surface.css('top', surfaceY + 'px');
}

/* 电池检测 */
var supportedBattery = false,
    lastCharging,
    lastLevel = 0,
    lastTime = 0;

function updateCharging() {
    var charging = battery.charging,
        level = battery.level,
        chargingTime = battery.chargingTime,
        dischargingTime = battery.dischargingTime,
        levelText = Math.floor(level * 100) + '%',
        statusText;
    if (!supportedBattery) {
        statusText = '您的浏览器不支持电池电量检测<br>随机显示电量，与设备实际剩余电量无关';
    } else if (charging && level === 1) {
        statusText = '电池已经充满';
    } else {
        statusText = (charging ? '充电中' : '放电中') + '<br>';
        if (charging !== lastCharging) {
            lastCharging = charging;
            lastLevel = 0;
            lastTime = 0;
        }
        if (lastLevel === 0 || lastLevel === level) {
            lastLevel = level;
            lastTime = new Date();
            statusText += '...';
        } else {
            var now = new Date(),
                step = Math.abs((level - lastLevel) / ((now - lastTime) / 1000)),
                time;
            if (charging) {
                time = isFinite(chargingTime) && chargingTime > 0 ?
                    chargingTime / 60 :
                    (1 - level) / step / 60;
                statusText += '约' + Math.round(time) + '分钟充满';
            } else {
                time = isFinite(dischargingTime) && dischargingTime > 0 ?
                    dischargingTime / 60 :
                    level / step / 60;
                statusText += '约' + Math.round(time) + '分钟用完';
            }
        }
    }
    $level.html(levelText);
    $status.html(statusText);
    updateIndicator(level);
}
 
if (battery) {
    supportedBattery = true;
    battery.addEventListener('chargingchange', updateCharging);
    battery.addEventListener('levelchange', updateCharging);
    battery.addEventListener('chargingtimechange', updateCharging);
    battery.addEventListener('dischargingtimechange', updateCharging);
} else {
    battery = {charging: false, level: Math.random()};
    updateCharging();
}