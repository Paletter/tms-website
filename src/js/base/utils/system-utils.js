define(function () {
    window.SystemUtils = {
        playSuccessSound : function() {
            var audioElement = document.createElement('audio');

            if (navigator.userAgent.match('Firefox/'))
                audioElement.setAttribute('src', '../../video/success.ogg');
            else
                audioElement.setAttribute('src', '../../video/success.mp3');

            audioElement.addEventListener("load", function () {
                audioElement.play();
            }, true);

            audioElement.pause();
            audioElement.play();
        },
        playFailureSound : function() {
            var audioElement = document.createElement('audio');

            if (navigator.userAgent.match('Firefox/'))
                audioElement.setAttribute('src', '../../video/failure.ogg');
            else
                audioElement.setAttribute('src', '../../video/failure.mp3');

            audioElement.addEventListener("load", function () {
                audioElement.play();
            }, true);

            audioElement.pause();
            audioElement.play();
        }
    };
    return window.SystemUtils;
});