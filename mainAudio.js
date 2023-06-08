let context,
    source,
    lowpass,
    panner;


function initAudio() {
    let check = document.getElementById('l');
    let audio = document.getElementById('favSong');
    audio.addEventListener('play', () => {
        if (!context) {
            context = new AudioContext();
            source = context.createMediaElementSource(audio);
            panner = context.createPanner();
            lowpass = context.createBiquadFilter();

            source.connect(panner);
            panner.connect(lowpass);
            lowpass.connect(context.destination);

            lowpass.type = 'lowpass';
            lowpass.Q.value = 1;
            lowpass.frequency.value = 1111;
            lowpass.gain.value = 11;
            context.resume();
        }
    })

    audio.addEventListener('pause', () => {
        console.log('pause');
        context.resume();
    })
    check.addEventListener('change', function () {
        if (check.checked) {
            panner.disconnect();
            panner.connect(lowpass);
            lowpass.connect(context.destination);
        } else {
            panner.disconnect();
            panner.connect(context.destination);
        }
    });
    audio.play();
}