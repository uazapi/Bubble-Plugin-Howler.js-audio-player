function(instance, properties, context) {
  if (instance.data.sound) {
    // Verifica se o som está atualmente tocando
    if (instance.data.sound.playing()) {
        // Se estiver tocando, pausa o som
        instance.data.sound.pause();
        console.log("Howler paused");
        instance.publishState('is_playing', false);
    } else {
        // Se não estiver tocando, dá play
        // Reaplica a taxa de reprodução atual antes de dar play, para garantir que seja respeitada
        if (instance.data.playbackRate) {
            instance.data.sound.rate(instance.data.playbackRate);
        }
        instance.data.sound.play();
        console.log("Howler playing");
        instance.publishState('is_playing', true);
    }
  }
}
