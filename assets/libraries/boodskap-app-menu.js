(function (window, document, $) {
  'use strict';
  $.app = $.app || {};
  var $body = $('body');
  var $window = $(window);
  var menuWrapper_el = $('div[data-menu="menu-wrapper"]').html();
  var menuWrapperClasses = $('div[data-menu="menu-wrapper"]').attr('class');
  $.app.menu = {
    expanded: null,
    collapsed: null,
    hidden: null,
    container: null,
    horizontalMenu: false,
    manualScroller: {
      obj: null, init: function () {
        var scroll_theme = ($('.main-menu').hasClass('menu-dark')) ? 'light' : 'dark';
        this.obj = $(".main-menu-content").perfectScrollbar({suppressScrollX: true, theme: scroll_theme});
      }, update: function () {
        if (this.obj) {
          if ($('.main-menu').data('scroll-to-active') === true) {
            var position;
            if ($(".main-menu-content").find('li.active').parents('li').length > 0) {
              position = $(".main-menu-content").find('li.active').parents('li').last().position();
            } else {
              position = $(".main-menu-content").find('li.active').position();
            }
            setTimeout(function () {
              $('.main-menu').data('scroll-to-active', 'false');
            }, 300);
          }
          $(".main-menu-content").perfectScrollbar('update');
        }
      }, enable: function () {
        this.init();
      }, disable: function () {
        if (this.obj) {
          $('.main-menu-content').perfectScrollbar('destroy');
        }
      }, updateHeight: function () {
        if (($body.data('menu') == 'vertical-menu' || $body.data('menu') == 'vertical-overlay-menu') && $('.main-menu').hasClass('menu-fixed')) {
          $('.main-menu-content').css('height', $(window).height() - $('.header-navbar').height() - $('.main-menu-header').outerHeight() - $('.main-menu-footer').outerHeight());
          this.update();
        }
      }
    },
    mMenu: {
      obj: null, init: function () {
        $(".main-menu").mmenu({
          slidingSubmenus: true,
          offCanvas: false,
          counters: false,
          navbar: {title: ''},
          navbars: [{position: 'top', content: ['searchfield']}],
          searchfield: {resultsPanel: true},
          setSelected: {parent: true}
        }, {classNames: {divider: "navigation-header", selected: "active"}, searchfield: {clear: true}});
        $('a.mm-next').addClass('mm-fullsubopen');
        this.obj = $(".main-menu").data("mmenu");
      }, enable: function () {
        this.init();
      }, disable: function () {
      }
    },
    init: function () {
      $body = $('body');
      if ($('.main-menu-content').length > 0) {
        this.container = $('.main-menu-content');
        var menuObj = this;
        this.change();
      } else {
        this.drillDownMenu();
      }
    },
    drillDownMenu: function (screenSize) {
      $body = $('body');
      if ($('.drilldown-menu').length) {
        if (screenSize == 'sm' || screenSize == 'xs') {
          if ($('#navbar-mobile').attr('aria-expanded') == 'true') {
            $('.drilldown-menu').slidingMenu({backLabel: true});
          }
        } else {
          $('.drilldown-menu').slidingMenu({backLabel: true});
        }
      }
    },
    change: function () {
      $body = $('body');
      var currentBreakpoint = Unison.fetch.now();
      this.reset();
      var menuType = $body.data('menu');
      if (currentBreakpoint) {
        switch (currentBreakpoint.name) {
          case'xl':
          case'lg':
            if (menuType === 'vertical-overlay-menu') {
              this.hide();
            } else if (menuType === 'vertical-compact-menu') {
              this.open();
            } else {
              this.expand();
            }
            break;
          case'md':
            if (menuType === 'vertical-overlay-menu' || menuType === 'vertical-mmenu') {
              this.hide();
            } else if (menuType === 'vertical-compact-menu') {
              this.open();
            } else {
              this.collapse();
            }
            break;
          case'sm':
            this.hide();
            break;
          case'xs':
            this.hide();
            break;
        }
      }
      if (menuType === 'vertical-menu' || menuType === 'vertical-compact-menu' || menuType === 'vertical-content-menu') {
        this.toOverlayMenu(currentBreakpoint.name);
      }
      if ($body.is('.horizontal-layout') && !$body.hasClass('.horizontal-menu-demo')) {
        this.changeMenu(currentBreakpoint.name);
        $('.menu-toggle').removeClass('is-active');
      }
      if (menuType != 'horizontal-menu' && menuType != 'horizontal-top-icon-menu') {
        this.drillDownMenu(currentBreakpoint.name);
      }
      if (currentBreakpoint.name == 'xl') {
        $('body[data-open="hover"] .dropdown').on('mouseenter', function () {
          if (!($(this).hasClass('open'))) {
            $(this).addClass('open');
          } else {
            $(this).removeClass('open');
          }
        }).on('mouseleave', function (event) {
          $(this).removeClass('open');
        });
        $('body[data-open="hover"] .dropdown a').on('click', function (e) {
          if (menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu') {
            var $this = $(this);
            if ($this.hasClass('dropdown-toggle')) {
              return false;
            }
          }
        });
      }
      if ($('.header-navbar').hasClass('navbar-brand-center')) {
        $('.header-navbar').attr('data-nav', 'brand-center');
      }
      if (currentBreakpoint.name == 'sm' || currentBreakpoint.name == 'xs') {
        $('.header-navbar[data-nav=brand-center]').removeClass('navbar-brand-center');
      } else {
        $('.header-navbar[data-nav=brand-center]').addClass('navbar-brand-center');
      }
      $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
        if ($(this).siblings('ul.dropdown-menu').length > 0) {
          event.preventDefault();
        }
        event.stopPropagation();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
      });
      if (menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu') {
        if (currentBreakpoint.name == 'sm' || currentBreakpoint.name == 'xs') {
          if ($(".menu-fixed").length) {
            $(".menu-fixed").unstick();
          }
        } else {
          if ($(".navbar-fixed").length) {
            $(".navbar-fixed").sticky();
          }
        }
      }

      function searchMenu(list) {
        var input = $(".menu-search");
        $(input).change(function () {
          var filter = $(this).val();
          if (filter) {
            $('.navigation-header').hide();
            $(list).find("li a:not(:Contains(" + filter + "))").hide().parent().hide();
            var searchFilter = $(list).find("li a:Contains(" + filter + ")");
            if (searchFilter.parent().hasClass('has-sub')) {
              searchFilter.show().parents('li').show().addClass('open').closest('li').children('a').show().children('li').show();
              if (searchFilter.siblings('ul').length > 0) {
                searchFilter.siblings('ul').children('li').show().children('a').show();
              }
            } else {
              searchFilter.show().parents('li').show().addClass('open').closest('li').children('a').show();
            }
          } else {
            $('.navigation-header').show();
            $(list).find("li a").show().parent().show().removeClass('open');
          }
          $.app.menu.manualScroller.update();
          return false;
        }).keyup(function () {
          $(this).change();
        });
      }

      if (menuType === 'vertical-menu' || menuType === 'vertical-overlay-menu' || menuType === 'vertical-content-menu') {
        jQuery.expr[':'].Contains = function (a, i, m) {
          return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };
        searchMenu($("#main-menu-navigation"));
      }
    },
    changeLogo: function (menuType) {
      $body = $('body');
      var logo = $('.brand-logo');
      if (menuType === 'expand') {
        logo.attr('src', logo.data('expand'));
      } else {
        logo.attr('src', logo.data('collapse'));
      }
    },
    transit: function (callback1, callback2) {
      $body = $('body');
      var menuObj = this;
      $body.addClass('changing-menu');
      callback1.call(menuObj);
      if ($body.hasClass('vertical-layout')) {
        if ($body.hasClass('menu-open') || $body.hasClass('menu-expanded')) {
          $('.menu-toggle').addClass('is-active');
          if ($body.data('menu') === 'vertical-menu' || $body.data('menu') === 'vertical-content-menu') {
            if ($('.main-menu-header')) {
              $('.main-menu-header').show();
            }
          }
        } else {
          $('.menu-toggle').removeClass('is-active');
          if ($body.data('menu') === 'vertical-menu' || $body.data('menu') === 'vertical-content-menu') {
            if ($('.main-menu-header')) {
              $('.main-menu-header').hide();
            }
          }
        }
      }
      setTimeout(function () {
        callback2.call(menuObj);
        $body.removeClass('changing-menu');
        menuObj.update();
      }, 500);
    },
    open: function () {
      $body = $('body');
      if ($body.is('.vertical-mmenu')) {
        this.mMenu.enable();
      }
      this.transit(function () {
        $body.removeClass('menu-hide menu-collapsed').addClass('menu-open');
        this.hidden = false;
        this.expanded = true;
      }, function () {
        if (!$('.main-menu').hasClass('menu-native-scroll') && !$body.is('.vertical-mmenu') && $('.main-menu').hasClass('menu-fixed')) {
          this.manualScroller.enable();
          $('.main-menu-content').css('height', $(window).height() - $('.header-navbar').height() - $('.main-menu-header').outerHeight() - $('.main-menu-footer').outerHeight());
        }
      });
    },
    hide: function () {
      $body = $('body');
      if ($body.is('.vertical-mmenu')) {
        this.mMenu.disable();
      }
      this.transit(function () {
        $body.removeClass('menu-open menu-expanded').addClass('menu-hide');
        this.hidden = true;
        this.expanded = false;
      }, function () {
        if (!$('.main-menu').hasClass('menu-native-scroll') && !$body.is('.vertical-mmenu') && $('.main-menu').hasClass('menu-fixed')) {
          this.manualScroller.enable();
        }
      });
    },
    expand: function () {
      $body = $('body');
      if (this.expanded === false) {
        if ($body.data('menu') == 'vertical-menu') {
          this.changeLogo('expand');
        }
        this.transit(function () {
          $body.removeClass('menu-collapsed').addClass('menu-expanded');
          this.collapsed = false;
          this.expanded = true;
        }, function () {
          if ($body.is('.vertical-mmenu')) {
            this.mMenu.enable();
          } else if (($('.main-menu').hasClass('menu-native-scroll') || $body.data('menu') == 'vertical-mmenu' || $body.data('menu') == 'horizontal-menu' || $body.data('menu') == 'horizontal-top-icon-menu')) {
            this.manualScroller.disable();
          } else {
            if ($('.main-menu').hasClass('menu-fixed')) this.manualScroller.enable();
          }
          if ($body.data('menu') == 'vertical-menu' && $('.main-menu').hasClass('menu-fixed')) {
            $('.main-menu-content').css('height', $(window).height() - $('.header-navbar').height() - $('.main-menu-header').outerHeight() - $('.main-menu-footer').outerHeight());
          }
        });
      }
    },
    collapse: function () {
      $body = $('body');
      if (this.collapsed === false) {
        if (($body.data('menu') == 'vertical-menu')) {
          this.changeLogo('collapse');
        }
        this.transit(function () {
          $body.removeClass('menu-expanded').addClass('menu-collapsed');
          this.collapsed = true;
          this.expanded = false;
        }, function () {
          if ($body.data('menu') == 'vertical-content-menu') {
            this.manualScroller.disable();
          }
          if (($body.data('menu') == 'horizontal-menu' || $body.data('menu') == 'horizontal-top-icon-menu') && $body.hasClass('vertical-overlay-menu')) {
            if ($('.main-menu').hasClass('menu-fixed')) this.manualScroller.enable();
          }
          if ($body.data('menu') == 'vertical-menu' && $('.main-menu').hasClass('menu-fixed')) {
            $('.main-menu-content').css('height', $(window).height() - $('.header-navbar').height());
          }
        });
      }
    },
    toOverlayMenu: function (screen) {
      $body = $('body');
      var menu = $body.data('menu');
      if (screen == 'sm' || screen == 'xs') {
        if ($body.hasClass(menu)) {
          $body.removeClass(menu).addClass('vertical-overlay-menu');
        }
        if (menu == 'vertical-content-menu') {
          $('.main-menu').addClass('menu-fixed');
        }
      } else {
        if ($body.hasClass('vertical-overlay-menu')) {
          $body.removeClass('vertical-overlay-menu').addClass(menu);
        }
        if (menu == 'vertical-content-menu') {
          $('.main-menu').removeClass('menu-fixed');
        }
      }
    },
    changeMenu: function (screen) {
      $body = $('body');
      $('div[data-menu="menu-wrapper"]').html('');
      $('div[data-menu="menu-wrapper"]').html(menuWrapper_el);
      var menuWrapper = $('div[data-menu="menu-wrapper"]'), menuContainer = $('div[data-menu="menu-container"]'),
        menuNavigation = $('ul[data-menu="menu-navigation"]'), megaMenu = $('li[data-menu="megamenu"]'),
        megaMenuCol = $('li[data-mega-col]'), dropdownMenu = $('li[data-menu="dropdown"]'),
        dropdownSubMenu = $('li[data-menu="dropdown-submenu"]');
      if (screen == 'sm' || screen == 'xs') {
        $body.removeClass($body.data('menu')).addClass('vertical-layout vertical-overlay-menu fixed-navbar');
        $('nav.header-navbar').addClass('navbar-fixed-top');
        menuWrapper.removeClass().addClass('main-menu menu-light menu-fixed menu-shadow');
        menuNavigation.removeClass().addClass('navigation navigation-main');
        megaMenu.removeClass('dropdown mega-dropdown').addClass('has-sub');
        megaMenu.children('ul').removeClass();
        megaMenuCol.each(function (index, el) {
          var megaMenuSub = $(el).find('.mega-menu-sub');
          megaMenuSub.find('li').has('ul').addClass('has-sub');
          var first_child = $(el).children().first(), first_child_text = '';
          if (first_child.is('h6')) {
            first_child_text = first_child.html();
            first_child.remove();
            $(el).prepend('<a href="#">' + first_child_text + '</a>').addClass('has-sub mega-menu-title');
          }
        });
        megaMenu.find('a').removeClass('dropdown-toggle');
        megaMenu.find('a').removeClass('dropdown-item');
        dropdownMenu.removeClass('dropdown').addClass('has-sub');
        dropdownMenu.find('a').removeClass('dropdown-toggle nav-link');
        dropdownMenu.children('ul').find('a').removeClass('dropdown-item');
        dropdownMenu.find('ul').removeClass('dropdown-menu');
        dropdownSubMenu.removeClass().addClass('has-sub');
        $.app.nav.init();
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).parent().siblings().removeClass('open');
          $(this).parent().toggleClass('open');
        });
      } else {
        $body.removeClass('vertical-layout vertical-overlay-menu fixed-navbar').addClass($body.data('menu'));
        $('nav.header-navbar').removeClass('navbar-fixed-top');
        menuWrapper.removeClass().addClass(menuWrapperClasses);
        this.drillDownMenu(screen);
        $('a.dropdown-item.nav-has-children').on('click', function () {
          event.preventDefault();
          event.stopPropagation();
        });
        $('a.dropdown-item.nav-has-parent').on('click', function () {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    },
    toggle: function () {
      $body = $('body');
      var currentBreakpoint = Unison.fetch.now();
      var collapsed = this.collapsed;
      var expanded = this.expanded;
      var hidden = this.hidden;
      var menu = $('body').data('menu');
      switch (currentBreakpoint.name) {
        case'xl':
        case'lg':
        case'md':
          if (expanded === true) {
            if (menu == 'vertical-compact-menu' || menu == 'vertical-mmenu' || menu == 'vertical-overlay-menu') {
              this.hide();
            } else {
              this.collapse();
            }
          } else {
            if (menu == 'vertical-compact-menu' || menu == 'vertical-mmenu' || menu == 'vertical-overlay-menu') {
              this.open();
            } else {
              this.expand();
            }
          }
          break;
        case'sm':
          if (hidden === true) {
            this.open();
          } else {
            this.hide();
          }
          break;
        case'xs':
          if (hidden === true) {
            this.open();
          } else {
            this.hide();
          }
          break;
      }
      this.drillDownMenu(currentBreakpoint.name);
    },
    update: function () {
      this.manualScroller.update();
    },
    reset: function () {
      this.expanded = false;
      this.collapsed = false;
      this.hidden = false;
      $body.removeClass('menu-hide menu-open menu-collapsed menu-expanded');
    },
  };
  $.app.nav = {
    container: $('.navigation-main'),
    initialized: false,
    navItem: $('.navigation-main').find('li').not('.navigation-category'),
    config: {speed: 300,},
    init: function (config) {
      this.initialized = true;
      $.extend(this.config, config);
      if (!$body.is('.vertical-mmenu')) {
        this.bind_events();
      }
    },
    bind_events: function () {
      var menuObj = this;
      $('.navigation-main').on('mouseenter.app.menu', 'li', function () {
        var $this = $(this);
        $('.hover', '.navigation-main').removeClass('hover');
        if ($body.hasClass('menu-collapsed') || ($body.data('menu') == 'vertical-compact-menu' && !$body.hasClass('vertical-overlay-menu'))) {
          $('.main-menu-content').children('span.menu-title').remove();
          $('.main-menu-content').children('a.menu-title').remove();
          $('.main-menu-content').children('ul.menu-content').remove();
          var menuTitle = $this.find('span.menu-title').clone(), tempTitle, tempLink;
          if (!$this.hasClass('has-sub')) {
            tempTitle = $this.find('span.menu-title').text();
            tempLink = $this.children('a').attr('href');
            if (tempTitle !== '') {
              menuTitle = $("<a>");
              menuTitle.attr("href", tempLink);
              menuTitle.attr("title", tempTitle);
              menuTitle.text(tempTitle);
              menuTitle.addClass("menu-title");
            }
          }
          var fromTop;
          if ($this.css("border-top")) {
            fromTop = $this.position().top + parseInt($this.css("border-top"), 10);
          } else {
            fromTop = $this.position().top;
          }
          if ($body.data('menu') !== 'vertical-compact-menu') {
            menuTitle.appendTo('.main-menu-content').css({position: 'fixed', top: fromTop,});
          }
          if ($this.hasClass('has-sub') && $this.hasClass('nav-item')) {
            var menuContent = $this.children('ul:first');
            menuObj.adjustSubmenu($this);
          }
        }
        $this.addClass('hover');
      }).on('mouseleave.app.menu', 'li', function () {
      }).on('active.app.menu', 'li', function (e) {
        $(this).addClass('active');
        e.stopPropagation();
      }).on('deactive.app.menu', 'li.active', function (e) {
        $(this).removeClass('active');
        e.stopPropagation();
      }).on('open.app.menu', 'li', function (e) {
        var $listItem = $(this);
        $listItem.addClass('open');
        menuObj.expand($listItem);
        if ($('.main-menu').hasClass('menu-collapsible')) {
          return false;
        } else {
          $listItem.siblings('.open').find('li.open').trigger('close.app.menu');
          $listItem.siblings('.open').trigger('close.app.menu');
        }
        e.stopPropagation();
      }).on('close.app.menu', 'li.open', function (e) {
        var $listItem = $(this);
        $listItem.removeClass('open');
        menuObj.collapse($listItem);
        e.stopPropagation();
      }).on('click.app.menu', 'li', function (e) {
        var $listItem = $(this);
        if ($listItem.is('.disabled')) {
          e.preventDefault();
        } else {
          if ($body.hasClass('menu-collapsed') || ($body.data('menu') == 'vertical-compact-menu' && $listItem.is('.has-sub') && !$body.hasClass('vertical-overlay-menu'))) {
            e.preventDefault();
          } else {
            if ($listItem.has('ul')) {
              if ($listItem.is('.open')) {
                $listItem.trigger('close.app.menu');
              } else {
                $listItem.trigger('open.app.menu');
              }
            } else {
              if (!$listItem.is('.active')) {
                $listItem.siblings('.active').trigger('deactive.app.menu');
                $listItem.trigger('active.app.menu');
              }
            }
          }
        }
        e.stopPropagation();
      });
      $('.main-menu-content').on('mouseleave', function () {
        if ($body.hasClass('menu-collapsed') || $body.data('menu') == 'vertical-compact-menu') {
          $('.main-menu-content').children('span.menu-title').remove();
          $('.main-menu-content').children('a.menu-title').remove();
          $('.main-menu-content').children('ul.menu-content').remove();
        }
        $('.hover', '.navigation-main').removeClass('hover');
      });
      $('.navigation-main li.has-sub > a').on('click', function (e) {
        e.preventDefault();
      });
      $('ul.menu-content').on('click', 'li', function (e) {
        var $listItem = $(this);
        if ($listItem.is('.disabled')) {
          e.preventDefault();
        } else {
          if ($listItem.has('ul')) {
            if ($listItem.is('.open')) {
              $listItem.removeClass('open');
              menuObj.collapse($listItem);
            } else {
              $listItem.addClass('open');
              menuObj.expand($listItem);
              if ($('.main-menu').hasClass('menu-collapsible')) {
                return false;
              } else {
                $listItem.siblings('.open').find('li.open').trigger('close.app.menu');
                $listItem.siblings('.open').trigger('close.app.menu');
              }
              e.stopPropagation();
            }
          } else {
            if (!$listItem.is('.active')) {
              $listItem.siblings('.active').trigger('deactive.app.menu');
              $listItem.trigger('active.app.menu');
            }
          }
        }
        e.stopPropagation();
      });
    },
    adjustSubmenu: function ($menuItem) {
      var menuHeaderHeight, menutop, topPos, winHeight, bottomOffset, subMenuHeight, popOutMenuHeight, borderWidth,
        scroll_theme, $submenu = $menuItem.children('ul:first'), ul = $submenu.clone(true);
      menuHeaderHeight = $('.main-menu-header').height();
      menutop = $menuItem.position().top;
      winHeight = $window.height() - $('.header-navbar').height();
      borderWidth = 0;
      subMenuHeight = $submenu.height();
      if (parseInt($menuItem.css("border-top"), 10) > 0) {
        borderWidth = parseInt($menuItem.css("border-top"), 10);
      }
      popOutMenuHeight = winHeight - menutop - $menuItem.height() - 30;
      scroll_theme = ($('.main-menu').hasClass('menu-dark')) ? 'light' : 'dark';
      if ($body.data('menu') === 'vertical-compact-menu') {
        topPos = menutop + borderWidth;
        popOutMenuHeight = winHeight - menutop - 30;
      } else if ($body.data('menu') === 'vertical-content-menu') {
        topPos = menutop + $menuItem.height() + borderWidth;
        popOutMenuHeight = winHeight - $('.content-header').height() - $menuItem.height() - menutop - 60;
      } else {
        topPos = menutop + $menuItem.height() + borderWidth;
      }
      if ($body.data('menu') == 'vertical-content-menu') {
        ul.addClass('menu-popout').appendTo('.main-menu-content').css({'top': topPos, 'position': 'fixed',});
      } else {
        ul.addClass('menu-popout').appendTo('.main-menu-content').css({
          'top': topPos,
          'position': 'fixed',
          'max-height': popOutMenuHeight,
        });
        $('.main-menu-content > ul.menu-content').perfectScrollbar({theme: scroll_theme,});
      }
    },
    collapse: function ($listItem, callback) {
      var $subList = $listItem.children('ul');
      $subList.show().slideUp($.app.nav.config.speed, function () {
        $(this).css('display', '');
        $(this).find('> li').removeClass('is-shown');
        if (callback) {
          callback();
        }
        $.app.nav.container.trigger('collapsed.app.menu');
      });
    },
    expand: function ($listItem, callback) {
      var $subList = $listItem.children('ul');
      var $children = $subList.children('li').addClass('is-hidden');
      $subList.hide().slideDown($.app.nav.config.speed, function () {
        $(this).css('display', '');
        if (callback) {
          callback();
        }
        $.app.nav.container.trigger('expanded.app.menu');
      });
      setTimeout(function () {
        $children.addClass('is-shown');
        $children.removeClass('is-hidden');
      }, 0);
    },
    refresh: function () {
      $.app.nav.container.find('.open').removeClass('open');
    },
  };
})(window, document, jQuery);
