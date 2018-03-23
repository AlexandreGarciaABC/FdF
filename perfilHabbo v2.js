/*globals jQuery, _userdata*/

(function($) {
  'use strict';

  $(function() {
    /**
     * Setar o avatar:
     */
    (function() {
      var $avatar = $('<img />', {
        'src': [
          'https://www.habbo.com.br/habbo-imaging/avatarimage',
          $.param({
            user          : _userdata.username,
            size          : 'b',
            action        : 'std',
            headonly      : '0',
            direction     : '3',
            gesture       : 'sml',
            img_format    : 'png',
            head_direction: '3'
          })
        ].join('?'),
        'title': _userdata.username
      });
  
      $('.habboImg').html($avatar.prop('outerHTML'));
    })();
    
    /**
     * Capturar as informações do usuário.
     */
    (function(getUser, storage) {
      $('#missaoHabbo').html('<i class="fa fa-refresh fa-spin"></i> Carregando missão...');
      
      var get = function () {
        getUser(_userdata.username)
          .done(function(res) {
            $.each(res.selectedBadges, function() {
              var $div = $('<div>', {
                'class': 'habbo-badge',
                'html': [
                  $('<img />', {
                    'src': 'http://images.habbo.com/c_images/album1584/' + this.code + '.gif',
                    'title': this.name
                  }).prop('outerHTML')
                ].join('')
              }).appendTo('.HbBadge');
              
              
              console.log($div.prop('outerHTML'));
            });
            /**
             * Caso o usuário tenha no mínimo um
             * caractere de missão:
             */
            if (!! res.motto.length) {
              /**
               * Prevenir XSS vindo do Habbo:
               */
              var $span = $('<span>', { 'text': res.motto });
              $('#missaoHabbo').html($span.prop('outerHTML'));

              /**
               * Guardar a missão no session storage,
               * para tornar o carregamento o mais
               * rápido possível.
               *
               * Abaixo, se tiver missão.
               */
              storage([
		$span.text()
              ].join(''));

              return;
            }
            
            $('#missaoHabbo').html('Você não tem missão.');
            
            /**
             * Guardar a missão no session storage,
             * para tornar o carregamento o mais
             * rápido possível.
             *
             * Abaixo, se não tiver missão.
             */
            storage([
              'Você não tem missão.'
            ].join(' '));
            
          })
        
          .fail(function() {
            $('#missaoHabbo').html('O usuário foi banido.');
            $('.HbBadge').html('O usuário não tem emblemas favoritados.');

            /**
             * Guardar a missão no session storage,
             * para tornar o carregamento o mais
             * rápido possível.
             *
             * Abaixo, se tiver banido.
             */
            storage([
              'O usuário foi banido.'
            ].join(' '));
          })
        ;
      };
      
      if (!! sessionStorage) {
        if (!! sessionStorage.getItem('habbo_motto')) {
          $('#missaoHabbo').html(sessionStorage.getItem('habbo_motto'));

          /**
           * Caso a página tiver sido carregada,
           * faça uma nova request para atualizar
           * os dados.
           */
          $(window).on('load', function() {
            setTimeout(function() {
              get();
            }, 1500);
          });
        } else {
          /**
           * Caso não hajam dados, simplesmente faça
           * a requisição normalmente.
           */
          get();
        }
      } else {
        /**
         * Caso o localStoare não exista, simplesmente
         * faça a requisição normalmente.
         */
        get();
      }
    })(function(username) {
      return $.get('https://www.habbo.com.br/api/public/users', {
        name: username,
        cache: false
      });
    }, function(content) {
      if (!! sessionStorage) {
        sessionStorage.setItem('habbo_motto', content);
      }

      return !! sessionStorage;
    });
  });
})(jQuery);

/**
 * @ignore
 *
 * made with <3 by Luiz
 */
