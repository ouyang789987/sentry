import {ThemeProvider} from 'emotion-theming';
import React from 'react';

import {mount} from 'enzyme';
import ConfigStore from 'app/stores/configStore';
import {OrganizationEmpty} from 'app/views/organizationEmpty';
import theme from 'app/utils/theme';

describe('OrganizationEmpty', function() {
  beforeEach(() => {
    MockApiClient.clearMockResponses();
    MockApiClient.addMockResponse({
      url: '/organizations/',
      body: [TestStubs.Organization()],
    });
  });

  afterEach(() => {});

  it('does not have organization create link if no "organizations:create" feature ', function() {
    ConfigStore.set('features', new Set([]));
    let wrapper = mount(
      <ThemeProvider theme={theme}>
        <OrganizationEmpty />
      </ThemeProvider>,
      TestStubs.routerContext()
    );
    expect(wrapper.find('Link[to="/organizations/new/"]')).toHaveLength(0);
  });

  it('has organization create link when "organizations:create" feature', function() {
    ConfigStore.set('features', new Set(['organizations:create']));
    let wrapper = mount(
      <ThemeProvider theme={theme}>
        <OrganizationEmpty />
      </ThemeProvider>,
      TestStubs.routerContext()
    );

    expect(wrapper.find('Link[to="/organizations/new/"]')).toHaveLength(1);
  });

  it('lists orgs that are pending deletion', function() {
    MockApiClient.addMockResponse({
      url: '/organizations/',
      body: [
        TestStubs.Organization({
          slug: 'org',
          status: {
            id: 'pending_deletion',
          },
        }),
      ],
    });
    let wrapper = mount(
      <ThemeProvider theme={theme}>
        <OrganizationEmpty />
      </ThemeProvider>,
      TestStubs.routerContext()
    );
    expect(wrapper.find('Link[to="/org/"]')).toHaveLength(1);
  });
});