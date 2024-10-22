function(instance, properties, context) {
    // Verifica se um novo arquivo de som foi fornecido e cria um novo Howl, se necessário
    if (properties.sound_file && (!instance.data.sound || instance.data.currentFile !== properties.sound_file)) {
        // Se um som já existe, interrompa e limpe antes de criar um novo
        if (instance.data.sound) {
            instance.data.sound.unload();
            clearInterval(instance.data.updateInterval);
        }

        instance.data.currentFile = properties.sound_file; // Armazena o arquivo atual para futuras verificações

        instance.data.sound = new Howl({
            src: [properties.sound_file],
            rate: properties.playback_rate,
            preload: properties.preload_bool,
     		html5: properties.html5_bool,
            onload: function() {
                // Áudio carregado, agora é seguro acessar a duração
                var duration = instance.data.sound.duration();
                instance.publishState('duration', duration);

                // Iniciar a atualização da posição atual
                if (instance.data.updateInterval) {
                    clearInterval(instance.data.updateInterval);
                }

                instance.data.updateInterval = setInterval(function() {
                    if (instance.data.sound.playing()) {
                        var currentSeek = instance.data.sound.seek() || 0;
                        var duration = instance.data.sound.duration();
                        var currentPosition = (currentSeek / duration) * 100;
                        instance.publishState('current_position', currentPosition.toFixed(2)); // Arredondamento para 2 casas decimais
                    }
                }, 100); // Ajuste conforme necessário para balancear precisão e desempenho

            },
            onend: function() {
                instance.publishState('current_position', 100);
                instance.publishState('is_playing', properties.loop_bool);
                instance.triggerEvent('on_end');
            },
        });
    }

    // Ajusta a taxa de reprodução diretamente sem recriar o Howl, a menos que o arquivo de som mude
if (properties.playback_rate !== undefined && instance.data.sound && instance.data.playbackRate !== properties.playback_rate) {
    instance.data.playbackRate = properties.playback_rate;
    instance.data.sound.rate(properties.playback_rate);
}

    
    // Ajusta a posição de reprodução se um valor de slider foi fornecido
    if (typeof properties.slider_value !== 'undefined') {
        if (instance.data.sound.state() === 'loaded') {
            const seekTime = (properties.slider_value / 100) * instance.data.sound.duration();
            instance.data.sound.seek(seekTime);
        }
    }
}