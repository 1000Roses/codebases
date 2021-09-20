/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/

// Generated by CoffeeScript 1.12.7
(function () {
  const extend = function (child, parent) {
      for (const key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  const { RouteId, getRouteIdFromPathname } = require('@trello/routes');

  const Alerts = require('app/scripts/views/lib/alerts');

  const { ApiError } = require('app/scripts/network/api-error');

  const { ApiPromise } = require('app/scripts/network/api-promise');

  const { Auth } = require('app/scripts/db/auth');

  const { PopOver } = require('app/scripts/views/lib/pop-over');

  const React = require('react');

  const {
    localizeServerError,
  } = require('app/scripts/lib/localize-server-error');

  const maybeDisplayOrgMemberLimitsError = require('app/scripts/views/organization/member-limits-error')
    .maybeDisplayOrgMemberLimitsError;

  const t = require('app/scripts/views/internal/recup-with-helpers')(
    'manage_members',
  );
  const { Analytics } = require('@trello/atlassian-analytics');

  const _ = require('underscore');
  const $ = require('jquery');
  const { l } = require('app/scripts/lib/localize');

  const useNonPublicIfAvailable = require('app/common/lib/util/non-public-fields-filter')
    .useNonPublicIfAvailable;

  const BulkAddOrgMembersView = require('app/scripts/views/organization/bulk-add-org-members-view-react');

  const InvitationLink = require('./invitation-link');

  const InvitationButton = require('./invitation-button');

  const LinkGoogleApps = require('./link-google-apps');

  const InviteAddName = require('./invite-add-name');

  const MemberList = require('./member-list');

  const siteDomain = require('@trello/config').siteDomain;

  const {
    BillingAddMembersSummaryWrapped,
  } = require('app/src/components/BillingAddMembersSummary');

  const UpgradeSmartComponentConnected = require('app/src/components/UpgradePrompts/UpgradeSmartComponent')
    .UpgradeSmartComponentConnected;

  const DEBOUNCE_DELAY = 250;

  const debounce = function (fn) {
    return _.debounce(fn, DEBOUNCE_DELAY);
  };

  const EMAIL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

  module.exports = (function (superClass) {
    extend(_Class, superClass);

    _Class.prototype.displayName = 'ManageOrgMembersComponent';

    function _Class(props) {
      _Class.__super__.constructor.call(this, props);
      this.props = props;
      this.state = {
        isSearching: false,
        members: null,
        searchValue: null,
        selectedMembers: [],
        preventDoubleClick: true,
      };
      this.renderMemberList = this.renderMemberList.bind(this);
      this.renderInvitationLink = this.renderInvitationLink.bind(this);
      this.renderInvitationButton = this.renderInvitationButton.bind(this);
      this.renderLinkGoogleApps = this.renderLinkGoogleApps.bind(this);
      this.renderInviteAddName = this.renderInviteAddName.bind(this);
      this.renderSummary = this.renderSummary.bind(this);
      this.toggleMember = this.toggleMember.bind(this);
      this.onSearchInputChange = this.onSearchInputChange.bind(this);
      this.onSearchInputClick = this.onSearchInputClick.bind(this);
      this.addSelectedMembers = this.addSelectedMembers.bind(this);
      this._handleError = this._handleError.bind(this);
      this.showBulkAddView = this.showBulkAddView.bind(this);
      this.renderAddButton = this.renderAddButton.bind(this);
      return;
    }
    _Class.prototype.componentDidMount = () => {
      Analytics.sendScreenEvent({
        name: 'inviteToWorkspaceInlineDialog',
      });
    };
    _Class.prototype.render = t.renderable(function () {
      let ref2, isSearching, members, searchValue, selectedMembers;
      (ref2 = this.state),
        (isSearching = ref2.isSearching),
        (members = ref2.members),
        (searchValue = ref2.searchValue),
        (selectedMembers = ref2.selectedMembers);
      const currentRouteId = getRouteIdFromPathname(window.location.pathname);
      const model = this.props.model;
      const showBillingSummary =
        (model.isBusinessClass() || model.isStandard()) &&
        !model.paysWithPurchaseOrder();
      const isMoonshot = currentRouteId === RouteId.CREATE_FIRST_TEAM;
      const searchClass = isSearching ? '' : '.hide';
      const isEmail =
        searchValue &&
        EMAIL_REGEX.test(searchValue) &&
        Auth.me().get('email') !== searchValue;
      const placeholder = l('add member placeholder');
      const canLinkGoogleApps =
        !isMoonshot &&
        model.isFeatureEnabled('googleApps') &&
        (!model.get('prefs').associatedDomain || this.googleAppsFetchFailed) &&
        model.editable();

      return t.div(
        '.add-member-popup.team-members-tab-layout',
        (function (_this) {
          return function () {
            t.div('.manage-member-invitation-section', function () {
              return t.div('.search-with-spinner', function () {
                t.h4(function () {
                  return t.icon('member', 'enter-email-address-or-name');
                });
                t.input('.search-member.js-autofocus', {
                  type: 'text',
                  placeholder: placeholder,
                  onClick: _this.onSearchInputClick,
                  onChange: _this.onSearchInputChange,
                });
                t.div('.spinner.small' + searchClass);
                return t.p(
                  '.u-bottom.quiet.bulk-add-members-copy',
                  function () {
                    t.format('big-team');
                    return t.a(
                      '.u-bottom.action-link',
                      {
                        href: '#',
                        onClick: _this.showBulkAddView,
                      },
                      function () {
                        return t.format('add-many-people-at-once');
                      },
                    );
                  },
                );
              });
            });
            if (members) {
              if (!members.length) {
                if (isEmail) {
                  _this.renderInviteAddName();
                } else {
                  t.div('.quiet.search-text.no-results', function () {
                    return t.format('no-results');
                  });
                }
              } else {
                _this.renderMemberList();
              }
            }
            if (!isMoonshot) {
              _this.renderInvitationLink();
            }
            t.div('.js-ad');
            if (canLinkGoogleApps) {
              _this.renderLinkGoogleApps();
            }
            if (!isMoonshot) {
              _this.renderBCPrompt();
            }
            if (showBillingSummary && selectedMembers.length) {
              _this.renderSummary();
            } else {
              _this.renderAddButton();
            }
            if (isMoonshot) {
              return _this.renderInvitationButton();
            }
          };
        })(this),
      );
    });

    _Class.prototype.renderMemberList = function () {
      let members, ref2, selectedMembers;
      (ref2 = this.state),
        (members = ref2.members),
        (selectedMembers = ref2.selectedMembers);

      return t.createElement(MemberList, {
        members: members,
        selectedMembers: selectedMembers,
        toggleMember: this.toggleMember,
      });
    };

    _Class.prototype.renderInvitationLink = function () {
      const model = this.props.model;
      const teamUrl = siteDomain + '/' + model.get('name');
      return t.createElement(InvitationLink, {
        apiUrl: model.url(),
        teamUrl: teamUrl,
        teamId: model.get('id'),
      });
    };

    _Class.prototype.renderInvitationButton = function () {
      const model = this.props.model;
      const teamUrl = siteDomain + '/' + model.get('name');
      return t.createElement(InvitationButton, {
        apiUrl: model.url(),
        teamUrl: teamUrl,
        teamId: model.get('id'),
      });
    };

    _Class.prototype.renderLinkGoogleApps = function () {
      let model, modelCache, ref2;
      (ref2 = this.props), (model = ref2.model), (modelCache = ref2.modelCache);
      const showBillingSummary =
        (model.isBusinessClass() || model.isStandard()) &&
        !model.paysWithPurchaseOrder();
      return t.createElement(LinkGoogleApps, {
        model: model,
        modelCache: modelCache,
        showBillingSummary: showBillingSummary,
      });
    };

    _Class.prototype.renderInviteAddName = function () {
      let model, modelCache, ref2;
      (ref2 = this.props), (model = ref2.model), (modelCache = ref2.modelCache);
      const searchValue = this.state.searchValue;
      const email = searchValue;
      return t.createElement(InviteAddName, {
        email: email,
        model: model,
        modelCache: modelCache,
      });
    };

    _Class.prototype.renderBCPrompt = function () {
      return t.div('.bc-prompt-invite-popover', () =>
        t.createElement(UpgradeSmartComponentConnected, {
          orgId: this.props.model.id,
          allowUpsell: true,
          promptId: 'inviteUpgradePromptFull',
        }),
      );
    };

    _Class.prototype.renderAddButton = function () {
      const selectedMembers = this.state.selectedMembers;
      const selectedMembersCount = selectedMembers.length;
      const addToTeamButtonClass = selectedMembersCount ? '' : '.disabled';

      return t.button(
        '.nch-button.nch-button--primary.full' + addToTeamButtonClass,
        {
          onClick: () => {
            Analytics.sendClickedButtonEvent({
              buttonName: 'addMembersButton',
              source: 'inviteToWorkspaceInlineDialog',
              containers: {
                organization: {
                  id: this.props.model.id,
                },
              },
            });

            Analytics.sendTrackEvent({
              action: 'added',
              actionSubject: 'member',
              source: 'inviteToWorkspaceInlineDialog',
              containers: {
                organization: {
                  id: this.props.model.id,
                },
              },
            });

            this.addSelectedMembers();
          },
          disabled: !selectedMembersCount,
        },
        () => {
          return t.format('add-to-team');
        },
      );
    };

    _Class.prototype.renderSummary = function () {
      return t.createElement(BillingAddMembersSummaryWrapped, {
        accountId: this.props.model.id,
        members: this.state.selectedMembers,
        addMembers: this.addSelectedMembers,
      });
    };

    _Class.prototype.toggleMember = function (idMember) {
      let selectedMembers;
      if (
        this.state.selectedMembers.some(function (id) {
          return id === idMember;
        })
      ) {
        selectedMembers = this.state.selectedMembers.filter(function (id) {
          return id !== idMember;
        });
      } else {
        selectedMembers = slice
          .call(this.state.selectedMembers)
          .concat([idMember]);
      }
      return this.setState({
        selectedMembers: selectedMembers,
      });
    };

    _Class.prototype.onSearchInputClick = function () {
      if (this.state.preventDoubleClick) {
        this.setState({
          preventDoubleClick: false,
          onKeyDown: true,
        });

        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'input',
          actionSubjectId: 'searchInput',
          source: 'inviteToWorkspaceInlineDialog',
          containers: {
            organization: {
              id: this.props.model.id,
            },
          },
        });

        setTimeout(() => {
          this.setState({
            preventDoubleClick: true,
          });
        }, 1000);
      }
    };

    _Class.prototype.onSearchInputChange = function (arg) {
      const value = arg.target.value;
      this.setState({
        selectedMembers: [],
      });
      if (!value.length) {
        return this.setState({
          members: null,
          searchValue: null,
        });
      } else {
        return this.searchMembers(value);
      }
    };

    _Class.prototype.searchMembers = debounce(function (searchValue) {
      searchValue = searchValue.toLowerCase().trim();
      this.setState({
        isSearching: true,
        searchValue: searchValue,
      });
      return ApiPromise({
        url: '/1/search/members/',
        type: 'get',
        data: {
          idOrganization: this.props.model.id,
          query: searchValue,
        },
        dataType: 'json',
      }).then(
        (function (_this) {
          return function (members) {
            members = _.chain(members)
              .filter(function (member) {
                return member.id;
              })
              .map(function (member) {
                return _.extend(member, {
                  avatarUrl: useNonPublicIfAvailable(member, 'avatarUrl'),
                  fullName: useNonPublicIfAvailable(member, 'fullName'),
                  initials: useNonPublicIfAvailable(member, 'initials'),
                });
              })
              .sortBy(function (member) {
                let ref2;
                return (ref2 = member.fullName) != null
                  ? ref2.toLocaleLowerCase()
                  : void 0;
              })
              .value();
            return _this.setState({
              isSearching: false,
              members: members,
            });
          };
        })(this),
      );
    });

    _Class.prototype.addSelectedMembers = function () {
      let members, ref2, selectedMembers;
      (ref2 = this.state),
        (members = ref2.members),
        (selectedMembers = ref2.selectedMembers);

      const model = this.props.model;

      if (maybeDisplayOrgMemberLimitsError(this.el, model, null)) {
        return;
      }

      selectedMembers.forEach(
        (function (_this) {
          return function (idMember) {
            const member = members.filter(function (m) {
              return m.id === idMember;
            })[0];
            return model
              .addMembers(member)
              ['catch'](ApiError, _this._handleError);
          };
        })(this),
      );
      return PopOver.hide();
    };

    _Class.prototype._handleError = function (resOrApiError) {
      const message = localizeServerError(resOrApiError);
      Alerts.showLiteralText(message, 'error', 'manage-org-members', 3000);
    };

    _Class.prototype.showBulkAddView = function (e) {
      const model = this.props.model;

      Analytics.sendClickedLinkEvent({
        linkName: 'inviteMultipleMembersToWorkspaceLink',
        source: 'inviteToWorkspaceInlineDialog',
        containers: {
          organization: {
            id: model.id,
          },
        },
      });

      return PopOver.pushView({
        elem: $(e.target).closest('a'),
        getViewTitle: function () {
          return l(['view title', 'add members']);
        },
        reactElement: (
          <BulkAddOrgMembersView key="bulk-add-members" model={model} />
        ),
      });
    };

    return _Class;
  })(React.Component);
}.call(this));