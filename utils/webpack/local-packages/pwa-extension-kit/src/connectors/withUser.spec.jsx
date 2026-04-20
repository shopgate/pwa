import React from 'react';
import { mount } from 'enzyme';
import withUser from './withUser';

let mockedMapStateToPropsSpy = jest.fn();
const mockedMapStateToPropsResult = {
  user: {
    isLoggedIn: true,
    id: 'test-id',
    email: 'foo@example.com',
    firstName: 'First name',
    lastName: 'Last name',
    displayName: 'First name Last name',
  }
}
jest.mock('react-redux', () => ({
  connect: (mapStateToProps) => Component => props => {
    mockedMapStateToPropsSpy(mapStateToProps);
    return (
      <Component
        user={mockedMapStateToPropsResult.user}
        {...props}
      />
    )
  }
}));
describe('/connectors/withUser', () => {
  const TestedComponent = props => <div>Test</div>;
  it('should create component and pass external props', () => {
    const ConnectedComponent = withUser(TestedComponent);
    const component = mount(<ConnectedComponent foo="bar" />);

    expect(component.find('TestedComponent').props()).toEqual({
      user: {
        ...mockedMapStateToPropsResult.user,
      },
      foo: 'bar',
    });
  });

  it('should map state to props correctly when data is available', () => {
    const state = {
      user: {
        login: {
          isLoggedIn: true,
        },
        data: {
          id: 'foo',
          mail: 'bar',
          firstName: 'first name',
          lastName: 'last name',
        },
      },
    };

    const mapStateToProps = mockedMapStateToPropsSpy.mock.calls[0][0];
    expect(mapStateToProps(state).user).toEqual({
      isLoggedIn: true,
      id: 'foo',
      email: 'bar',
      firstName: 'first name',
      lastName: 'last name',
      displayName: 'first name last name',
    });
  });

  it('should map state to props correctly when data is NOT available', () => {
    const state = {
      user: {
        login: {},
        data: {},
      },
    };

    const mapStateToProps = mockedMapStateToPropsSpy.mock.calls[0][0];
    expect(mapStateToProps(state).user).toEqual({
      isLoggedIn: false,
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      displayName: null,
    });
  });

  it('should map state to props correctly when data is NOT prepared', () => {
    const state = {
      user: {},
    };

    const mapStateToProps = mockedMapStateToPropsSpy.mock.calls[0][0];
    expect(mapStateToProps(state).user).toEqual({
      isLoggedIn: false,
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      displayName: null,
    });
  });
});
