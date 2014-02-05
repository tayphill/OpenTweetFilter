// Generated by CoffeeScript 1.7.1
(function() {
  var DialogViewModel, Extension, PhoenixT1DialogView, PhoenixT1Provider, PhoenixT1ReportView, Provider, ReportViewModel, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.messages = {
    lang: function() {
      if ($('body').hasClass('es')) {
        return 'es';
      } else {
        return 'en';
      }
    },
    get: function(key) {
      return this[this.lang()][key] || '#' + key + '#';
    }
  };

  this.messages.en = {
    filter_dialog_title: 'Filters',
    enable: 'Enable',
    disable: 'Disable',
    excluding: 'Excluding',
    including: 'Including',
    tweets_terms: 'tweets containing terms',
    tweets_users: 'tweets from people',
    filter_terms_list_title: 'Terms separated by commas,<br/>eg.: twitcam, #fail',
    filter_users_list_title: 'Usernames separated by commas,<br/>eg.: twitterowsky, robocopano',
    show_report_view: 'Show report of filtered tweets.',
    bookmarklet_text: 'OpenTweetFilter Settings',
    bookmarklet_title: 'Drag this bookmarklet to the bookmarks bar so you can backup your filters',
    filtering_by_start: 'Hiding',
    filtering_by_end: 'tweets by filter of',
    filtering_by_end_singular: 'tweet by filter of',
    users_with_hidden_tweets: 'Users with hidden tweets',
    terms: 'terms',
    people: 'people',
    and: 'and',
    clear: 'Clear',
    filter: 'Filters',
    welcome_tip: 'Pssst... Here you can configure<br/>the Open Tweet Filter extension.'
  };

  this.messages.es = {
    filter_dialog_title: 'Filtros',
    enable: 'Activar',
    disable: 'Desactivar',
    excluding: 'Excluyendo',
    including: 'Incluyendo',
    tweets_terms: 'tweets con términos',
    tweets_users: 'tweets de usuarios',
    filter_terms_list_title: 'Términos separados por comas.<br/>Por ej.: twitcam, jijiji',
    filter_users_list_title: 'Usuarios separados por comas.<br/>Por ej.: tuiterowsky, robocopano',
    show_report_view: 'Mostrar resumen de tweets filtrados.',
    bookmarklet_text: 'Configuración de OpenTweetFilter',
    bookmarklet_title: 'Arrastra este elemento a la barra de marcadores para respaldar tus filtros',
    filtering_by_start: 'Ocultando',
    filtering_by_end: 'tweets por filtro de',
    filtering_by_end_singular: 'tweet por filtro de',
    users_with_hidden_tweets: 'Usuarios con tweets ocultos',
    terms: 'términos',
    people: 'usuarios',
    and: 'y',
    clear: 'Limpiar',
    filter: 'Filtros',
    welcome_tip: 'Pssst... Aquí puedes configurar<br/>la extensión Open Tweet Filter.'
  };

  DialogViewModel = (function() {
    DialogViewModel.prototype.version = 2;

    DialogViewModel.prototype.settings = {
      termsList: '',
      termsExclude: true,
      usersList: '',
      usersExclude: true,
      enabled: true,
      showReportView: true
    };

    function DialogViewModel() {
      var $default, setting, _ref;
      this.showWelcomeTip = ko.observable(true, {
        persist: 'TwitterFilter.showWelcomeTip_002'
      });
      _ref = this.settings;
      for (setting in _ref) {
        $default = _ref[setting];
        this[setting] = ko.observable($default, {
          persist: 'TwitterFilter.' + setting
        });
      }
      this.migrateSince(1);
      this.visible = ko.observable(false);
      this.toggleText = ko.computed((function(_this) {
        return function() {
          if (_this.enabled()) {
            return messages.get('disable');
          } else {
            return messages.get('enable');
          }
        };
      })(this));
      this.termsExcludeText = ko.computed((function(_this) {
        return function() {
          if (_this.termsExclude()) {
            return messages.get('excluding');
          } else {
            return messages.get('including');
          }
        };
      })(this));
      this.usersExcludeText = ko.computed((function(_this) {
        return function() {
          if (_this.usersExclude()) {
            return messages.get('excluding');
          } else {
            return messages.get('including');
          }
        };
      })(this));
      this.bookmarklet = ko.computed((function(_this) {
        return function() {
          var code, set, sets;
          set = function(setting) {
            var observable, value;
            observable = _this[setting];
            value = JSON.stringify(observable()).replace(/\\/g, "\\\\").replace(/\'/g, "\\'");
            return "s('" + observable.persistKey + "','" + value + "');";
          };
          sets = ((function() {
            var _results;
            _results = [];
            for (setting in this.settings) {
              _results.push(set(setting));
            }
            return _results;
          }).call(_this)).join('');
          code = "javascript:(function(){\nfunction s(k,v){window.localStorage.setItem(k,v);}\n" + sets + "\n$('<div id=\"filter-reload\" data-version=\"" + _this.version + "\"></div>').appendTo($('#filter-button'));\n})();";
          return code.replace(/\n/g, '');
        };
      })(this));
    }

    DialogViewModel.prototype.clear = function() {
      var $default, setting, _ref, _results;
      _ref = this.settings;
      _results = [];
      for (setting in _ref) {
        $default = _ref[setting];
        _results.push(this[setting]($default));
      }
      return _results;
    };

    DialogViewModel.prototype.reload = function() {
      var setting, _results;
      _results = [];
      for (setting in this.settings) {
        _results.push(this[setting].reload());
      }
      return _results;
    };

    DialogViewModel.prototype.onSettingsChange = function(callback) {
      var setting, _results;
      _results = [];
      for (setting in this.settings) {
        _results.push(this[setting].subscribe(callback));
      }
      return _results;
    };

    DialogViewModel.prototype.bookmarkletLoaded = function(version) {
      this.migrateSince(version);
      return this.reload();
    };

    DialogViewModel.prototype.toggle = function(attr) {
      return this[attr](!this[attr]());
    };

    DialogViewModel.prototype.toggleEnabled = function() {
      return this.toggle('enabled');
    };

    DialogViewModel.prototype.toggleVisible = function() {
      return this.toggle('visible');
    };

    DialogViewModel.prototype.toggleTermsExclude = function() {
      return this.toggle('termsExclude');
    };

    DialogViewModel.prototype.toggleUsersExclude = function() {
      return this.toggle('usersExclude');
    };

    DialogViewModel.prototype.toggleShowReportView = function() {
      return this.toggle('showReportView');
    };

    DialogViewModel.prototype.migrateSince = function(sinceVersion) {
      var version, _results;
      version = sinceVersion + 1;
      _results = [];
      while (version <= this.version) {
        _results.push(this.migrations[version++]());
      }
      return _results;
    };

    DialogViewModel.prototype.migrations = {
      2: function() {
        var toBoolean, up;
        up = function(oldKey, newKey, map) {
          var oldValue;
          oldValue = localStorage.getItem(oldKey);
          if (oldValue != null) {
            if (map != null) {
              oldValue = map(oldValue);
            }
            localStorage.setItem('TwitterFilter.' + newKey, JSON.stringify(oldValue));
            return localStorage.removeItem(oldKey);
          }
        };
        toBoolean = function(x) {
          return x === '1';
        };
        up('filter_terms_list', 'termsList');
        up('filter_terms_exclude', 'termsExclude', toBoolean);
        up('filter_from_list', 'usersList');
        up('filter_from_exclude', 'usersExclude', toBoolean);
        return up('filter_enabled', 'enabled', toBoolean);
      },
      3: function() {}
    };

    return DialogViewModel;

  })();

  ReportViewModel = (function() {
    function ReportViewModel(dialogViewModel) {
      this.applied = ko.observable(false);
      this.hasTerms = ko.observable(false);
      this.hasUsers = ko.observable(false);
      this.hiddenCount = ko.observable(false);
      this.hiddenUsers = ko.observable(false);
      this.visible = ko.computed((function(_this) {
        return function() {
          return dialogViewModel.showReportView() && _this.applied() && (_this.hasTerms() || _this.hasUsers());
        };
      })(this));
      this.hasHiddenTweets = ko.computed((function(_this) {
        return function() {
          return _this.hiddenCount() !== 0;
        };
      })(this));
      this.filteringByEndMessage = ko.computed((function(_this) {
        return function() {
          if (_this.hiddenCount() === 1) {
            return messages.get('filtering_by_end_singular');
          } else {
            return messages.get('filtering_by_end');
          }
        };
      })(this));
      this.filtersMessage = ko.computed((function(_this) {
        return function() {
          var filters;
          filters = [];
          if (_this.hasTerms()) {
            filters.push(messages.get('terms'));
          }
          if (_this.hasUsers()) {
            filters.push(messages.get('people'));
          }
          return filters.join(' ' + messages.get('and') + ' ');
        };
      })(this));
      this.usersPhotos = ko.computed((function(_this) {
        return function() {
          var src, title, _ref, _results;
          _ref = _this.hiddenUsers();
          _results = [];
          for (title in _ref) {
            src = _ref[title];
            if (src) {
              _results.push({
                title: title,
                src: src
              });
            }
          }
          return _results;
        };
      })(this));
      this.usersNames = ko.computed((function(_this) {
        return function() {
          var src, title, _ref, _results;
          _ref = _this.hiddenUsers();
          _results = [];
          for (title in _ref) {
            src = _ref[title];
            if (!src) {
              _results.push(title);
            }
          }
          return _results;
        };
      })(this));
    }

    return ReportViewModel;

  })();

  View = (function() {
    function View() {}

    View.prototype.render = function(viewModel) {
      throw new Error('Not implemented');
    };

    return View;

  })();

  PhoenixT1DialogView = (function(_super) {
    __extends(PhoenixT1DialogView, _super);

    function PhoenixT1DialogView() {
      return PhoenixT1DialogView.__super__.constructor.apply(this, arguments);
    }

    PhoenixT1DialogView.prototype.render = function(viewModel) {
      this.renderButton(viewModel);
      this.renderDialog(viewModel);
      this.monitorBookmarklet(viewModel);
      return this.showWelcomeTip(viewModel);
    };

    PhoenixT1DialogView.prototype.renderButton = function(viewModel) {
      var buttonTemplate;
      buttonTemplate = function() {
        return li('#filter-button', {
          'data-name': 'filter'
        }, function() {
          return a('.js-filter-dialog', {
            href: '#',
            'data-bind': 'click: toggleVisible'
          }, function() {
            return messages.get('filter');
          });
        });
      };
      $('#user-dropdown ul li:nth-child(5)').after(CoffeeKup.render(buttonTemplate));
      return ko.applyBindings(viewModel, $('#filter-button')[0]);
    };

    PhoenixT1DialogView.prototype.renderDialog = function(viewModel) {
      var dialogHtml;
      dialogHtml = CoffeeKup.render(this.dialogTemplate);
      return viewModel.visible.subscribe((function(_this) {
        return function(visible) {
          return _this.visibleToggled(visible, dialogHtml, viewModel, {
            appendTo: 'body',
            center: true
          });
        };
      })(this));
    };

    PhoenixT1DialogView.prototype.dialogHeaderSelector = '.modal-header';

    PhoenixT1DialogView.prototype.dialogTemplate = function() {
      return div('#filter-dialog-container.modal-container.draggable', function() {
        div('.close-modal-background-target', function() {});
        return div('#filter-dialog.modal', function() {
          return div('.modal-content', function() {
            button('.modal-btn.modal-close', {
              'data-bind': 'click: toggleVisible'
            }, function() {
              return i('.close-medium', function() {});
            });
            div('.modal-header', function() {
              return h3('.modal-title', function() {
                return messages.get('filter_dialog_title');
              });
            });
            div('.modal-body', function() {
              return fieldset(function() {
                a('.btn.filter-list-label', {
                  'data-bind': 'text: termsExcludeText, click: toggleTermsExclude'
                });
                div('.filter-list-label', function() {
                  return '&nbsp;' + messages.get('tweets_terms') + ':';
                });
                input('.filter-terms-list', {
                  'type': 'text',
                  'data-bind': "value: termsList, valueUpdate: ['change', 'afterkeydown']"
                });
                div(function() {
                  return '&nbsp;';
                });
                a('.btn.filter-list-label', {
                  'data-bind': 'text: usersExcludeText, click: toggleUsersExclude'
                });
                div('.filter-list-label', function() {
                  return '&nbsp;' + messages.get('tweets_users') + ':';
                });
                input('.filter-users-list', {
                  'type': 'text',
                  'data-bind': "value: usersList, valueUpdate: ['change', 'afterkeydown']"
                });
                return label('.checkbox', function() {
                  input({
                    'type': 'checkbox',
                    'data-bind': "checked: showReportView"
                  });
                  return span({
                    'data-bind': 'click: toggleShowReportView'
                  }, function() {
                    return messages.get('show_report_view');
                  });
                });
              });
            });
            return div('.modal-footer', function() {
              div('.filter-dialog-footer-left', function() {
                return a('.btn', {
                  'data-bind': 'click: clear'
                }, function() {
                  return messages.get('clear');
                });
              });
              return div('.filter-dialog-footer-right', function() {
                a('.filter-bookmarklet', {
                  'data-bind': 'attr: {href: bookmarklet}'
                }, function() {
                  return messages.get('bookmarklet_text');
                });
                return a('.btn', {
                  'data-bind': 'text: toggleText, click: toggleEnabled'
                });
              });
            });
          });
        });
      });
    };

    PhoenixT1DialogView.prototype.visibleToggled = (function() {
      var container, overlay;
      container = null;
      overlay = $('<div class="twttr-dialog-overlay"></div>').appendTo($('body'));
      return function(visible, dialogHtml, viewModel, options) {
        var dialog;
        if (visible) {
          overlay.show();
          container = $(dialogHtml).appendTo($(options.appendTo));
          container.show();
          if (options.center) {
            dialog = $('#filter-dialog');
            dialog.css('position', 'absolute').css('top', (($(window).height() - dialog.outerHeight()) / 2) + 'px').css('left', (($(window).width() - dialog.outerWidth()) / 2) + 'px');
          }
          container.draggable({
            handle: this.dialogHeaderSelector
          });
          container.on('keydown keypress', function(event) {
            return event.stopPropagation();
          });
          container.find('.filter-terms-list').tipsy({
            gravity: 'w',
            trigger: 'focus',
            html: true,
            fallback: messages.get('filter_terms_list_title')
          });
          container.find('.filter-users-list').tipsy({
            gravity: 'w',
            trigger: 'focus',
            html: true,
            fallback: messages.get('filter_users_list_title')
          });
          container.find('.filter-bookmarklet').tipsy({
            gravity: 'n',
            trigger: 'hover',
            html: true,
            fallback: messages.get('bookmarklet_title')
          });
          viewModel.reload();
          return ko.applyBindings(viewModel, container[0]);
        } else {
          container.find('.filter-terms-list').tipsy('hide');
          container.find('.filter-users-list').tipsy('hide');
          container.find('.filter-bookmarklet').tipsy('hide');
          ko.cleanNode(container[0]);
          container.remove();
          return overlay.hide();
        }
      };
    })();

    PhoenixT1DialogView.prototype.monitorBookmarklet = function(viewModel) {
      return $('#filter-button').on('DOMNodeInserted', function(event) {
        var el;
        el = $(event.target);
        viewModel.bookmarkletLoaded(el.data('version'));
        return el.remove();
      });
    };

    PhoenixT1DialogView.prototype.welcomeTip = function() {
      return $('#user-dropdown i.nav-session');
    };

    PhoenixT1DialogView.prototype.showWelcomeTip = function(viewModel) {
      if (viewModel.showWelcomeTip()) {
        return setTimeout((function(_this) {
          return function() {
            _this.welcomeTip().tipsy({
              gravity: 'n',
              trigger: 'manual',
              html: true,
              fallback: messages.get('welcome_tip')
            }).tipsy('show').click(function() {
              return $(this).tipsy('hide');
            });
            setTimeout(function() {
              return _this.welcomeTip().tipsy('hide');
            }, 30000);
            return viewModel.showWelcomeTip(false);
          };
        })(this), 3000);
      }
    };

    return PhoenixT1DialogView;

  })(View);

  PhoenixT1ReportView = (function(_super) {
    __extends(PhoenixT1ReportView, _super);

    function PhoenixT1ReportView() {
      return PhoenixT1ReportView.__super__.constructor.apply(this, arguments);
    }

    PhoenixT1ReportView.prototype.template = function() {
      return div('.filter-report-component.component', {
        'data-bind': 'visible: visible'
      }, function() {
        return div('.module', function() {
          return div('.flex-module', function() {
            div('.flex-module-header', function() {
              return h3(headerTemplate);
            });
            return div('.flex-module-inner', function() {
              return div(bodyTemplate);
            });
          });
        });
      });
    };

    PhoenixT1ReportView.prototype.headerTemplate = function() {
      text(messages.get('filtering_by_start'));
      text(' ');
      span('.user-stat-link', {
        'data-bind': 'text: hiddenCount'
      });
      text(' ');
      span({
        'data-bind': 'text: filteringByEndMessage'
      });
      text(' ');
      return span({
        'data-bind': 'text: filtersMessage'
      });
    };

    PhoenixT1ReportView.prototype.bodyTemplate = function() {
      span({
        'data-bind': 'if: hasHiddenTweets'
      }, function() {
        span(function() {
          return messages.get('users_with_hidden_tweets') + ':';
        });
        return br(function() {});
      });
      span({
        'data-bind': 'foreach: usersPhotos'
      }, function() {
        return img({
          'data-bind': 'attr: {src: $data.src, title: $data.title}',
          style: 'margin-right:5px;',
          width: 24,
          height: 24
        });
      });
      return span({
        'data-bind': 'foreach: usersNames'
      }, function() {
        return div({
          'data-bind': 'text: $data + "&nbsp;&nbsp"'
        });
      });
    };

    PhoenixT1ReportView.prototype.render = function(viewModel) {
      var html;
      $('.filter-report-component').each(function() {
        return ko.cleanNode(this);
      }).remove();
      html = CoffeeKup.render(this.template, {
        hardcode: {
          headerTemplate: this.headerTemplate,
          bodyTemplate: this.bodyTemplate
        }
      });
      $('.dashboard').find('>.component:not(:empty):eq(0),>.module:not(:empty):eq(0)').first().after(html);
      return ko.applyBindings(viewModel, $('.filter-report-component')[0]);
    };

    return PhoenixT1ReportView;

  })(View);

  Provider = (function() {
    function Provider() {}

    Provider.prototype.inMyProfilePage = function() {
      return this.screenUser() === this.sessionUser();
    };

    Provider.prototype.normalizeUser = function(x) {
      if (x != null) {
        return x.replace('@', '').trim();
      } else {
        return '';
      }
    };

    Provider.getActive = function() {
      var p, providers, _i, _len, _ref;
      providers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = providers.map(function(x) {
        return new x;
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.isActive()) {
          return p;
        }
      }
    };

    return Provider;

  })();

  PhoenixT1Provider = (function(_super) {
    __extends(PhoenixT1Provider, _super);

    function PhoenixT1Provider() {
      return PhoenixT1Provider.__super__.constructor.apply(this, arguments);
    }

    PhoenixT1Provider.prototype.dialogView = new PhoenixT1DialogView;

    PhoenixT1Provider.prototype.reportView = new PhoenixT1ReportView;

    PhoenixT1Provider.prototype.isActive = function() {
      return $('body').hasClass('t1');
    };

    PhoenixT1Provider.prototype.filterCurrentPage = function() {
      var isIgnorablePage, _ref;
      isIgnorablePage = (_ref = location.pathname + location.hash, __indexOf.call(this.ignorablePages(), _ref) >= 0);
      return !(this.inMyProfilePage() || isIgnorablePage);
    };

    PhoenixT1Provider.prototype.ignorablePages = function() {
      return ['/' + this.sessionUser() + '/lists', '/i/#!/who_to_follow/suggestions', '/i/#!/who_to_follow/import', '/i/#!/who_to_follow/interests'];
    };

    PhoenixT1Provider.prototype.sessionUser = function() {
      return this.normalizeUser($('.account-group.js-mini-current-user').data('screen-name'));
    };

    PhoenixT1Provider.prototype.screenUser = function() {
      return this.normalizeUser($('.screen-name.hidden').text());
    };

    PhoenixT1Provider.prototype.tweets = function() {
      return $('div.tweet.js-original-tweet.js-stream-tweet');
    };

    PhoenixT1Provider.prototype.tweetText = function(el) {
      return $(el).find('.js-tweet-text, .tweet-text,.entry-content, .twtr-tweet-text').text();
    };

    PhoenixT1Provider.prototype.tweetAuthor = function(el) {
      return this.normalizeUser($(el).find('.username').text());
    };

    PhoenixT1Provider.prototype.tweetAuthorPhoto = function(el) {
      return $(el).find('img.avatar').attr('src');
    };

    PhoenixT1Provider.prototype.tweetRetweeter = function(el) {
      var href;
      href = $(el).find('.pretty-link.js-user-profile-link').attr('href');
      if (href) {
        return href.replace('/#!/', '');
      } else {
        return '';
      }
    };

    PhoenixT1Provider.prototype.onNewTweets = function(callback) {
      return $(document).on('DOMNodeInserted', '.stream .stream-items', (function(_this) {
        return function() {
          var tweetsCount;
          tweetsCount = _this.tweets().size();
          if (_this.tweetsCount !== tweetsCount) {
            _this.tweetsCount = tweetsCount;
            return callback();
          }
        };
      })(this));
    };

    return PhoenixT1Provider;

  })(Provider);

  Extension = (function() {
    Extension.prototype.provider = Provider.getActive(PhoenixT1Provider);

    function Extension() {
      this.dialogViewModel = new DialogViewModel;
      this.reportViewModel = new ReportViewModel(this.dialogViewModel);
      this.provider.dialogView.render(this.dialogViewModel);
      $(window).on('hashchange', (function(_this) {
        return function() {
          return setTimeout((function() {
            return _this.applyFilter();
          }), 500);
        };
      })(this));
      this.provider.onNewTweets((function(_this) {
        return function() {
          return _this.applyFilter();
        };
      })(this));
      this.dialogViewModel.onSettingsChange((function(_this) {
        return function() {
          return _this.applyFilter();
        };
      })(this));
      this.applyFilter();
    }

    Extension.prototype.applyFilter = function() {
      return this.throttle(10, (function(_this) {
        return function() {
          var apply, hiddenCount, hiddenUsers, termsRegExp, usersRegExp;
          _this.dialogViewModel.reload();
          apply = _this.dialogViewModel.enabled() && _this.provider.filterCurrentPage();
          if (apply) {
            termsRegExp = _this.filterRegExp(_this.filterPattern(_this.dialogViewModel.termsList(), false));
            usersRegExp = _this.filterRegExp(_this.filterPattern(_this.dialogViewModel.usersList(), true));
          }
          hiddenCount = 0;
          hiddenUsers = {};
          _this.provider.tweets().each(function(i, el) {
            var foundTermsMatches, foundUserMatches, termsMatch, tweetAuthor, usersMatch;
            termsMatch = false;
            usersMatch = false;
            if (apply) {
              tweetAuthor = _this.provider.tweetAuthor(el);
              if (termsRegExp != null) {
                termsRegExp.lastIndex = 0;
                foundTermsMatches = termsRegExp.test(_this.provider.tweetText(el));
                termsMatch = _this.dialogViewModel.termsExclude() === foundTermsMatches;
              }
              if (usersRegExp != null) {
                usersRegExp.lastIndex = 0;
                foundUserMatches = usersRegExp.test(tweetAuthor);
                if (!foundUserMatches) {
                  usersRegExp.lastIndex = 0;
                  foundUserMatches = usersRegExp.test(_this.provider.tweetRetweeter(el));
                }
                usersMatch = _this.dialogViewModel.usersExclude() === foundUserMatches;
              }
            }
            if (termsMatch || usersMatch) {
              el.style.display = 'none';
              hiddenCount++;
              if (!(tweetAuthor in hiddenUsers)) {
                return hiddenUsers[tweetAuthor] = _this.provider.tweetAuthorPhoto(el);
              }
            } else {
              return el.style.display = 'block';
            }
          });
          _this.reportViewModel.applied(apply).hasTerms(termsRegExp != null).hasUsers(usersRegExp != null).hiddenCount(hiddenCount).hiddenUsers(hiddenUsers);
          return _this.throttle(1000, function() {
            return _this.provider.reportView.render(_this.reportViewModel);
          });
        };
      })(this));
    };

    Extension.prototype.throttle = (function() {
      var timeout;
      timeout = {};
      return function(delay, fn) {
        var key;
        key = fn.toString();
        clearTimeout(timeout[key]);
        return timeout[key] = setTimeout(fn, delay);
      };
    })();

    Extension.prototype.filterPattern = function(csv, whole) {
      var values;
      values = csv.split(',');
      values = $.map(values, function(v, i) {
        v = $.trim(v);
        if (v.length > 2 && v[0] === '/' && v[v.length - 1] === '/') {
          return v.substr(1, v.length - 2);
        } else {
          return v.replace(/([\.\(\)\[\]\{\}\+\*\?\\])/g, '\\$1');
        }
      });
      values = $.grep(values, function(v, i) {
        return v !== '';
      });
      if (values.length === 0) {
        return null;
      }
      values = '(' + values.join('|') + ')';
      if (whole) {
        return "^" + values + "$";
      } else {
        return values;
      }
    };

    Extension.prototype.filterRegExp = function(pattern) {
      var e;
      if (pattern == null) {
        return null;
      }
      try {
        return new RegExp(pattern, 'gi');
      } catch (_error) {
        e = _error;
        return null;
      }
    };

    return Extension;

  })();

  new Extension();

}).call(this);
