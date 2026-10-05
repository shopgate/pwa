import { render, screen } from '@testing-library/react';
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
  const TestedComponent = jest.fn(() => <div>Test</div>);
  let mapStateToProps;

  beforeAll(() => {
    const ConnectedComponent = withUser(TestedComponent);
    render(<ConnectedComponent />).unmount();
    [[mapStateToProps]] = mockedMapStateToPropsSpy.mock.calls;
    TestedComponent.mockClear();
  });

  it('should create component and pass external props', () => {
    const ConnectedComponent = withUser(TestedComponent);
    render(<ConnectedComponent foo="bar" />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(TestedComponent.mock.lastCall[0]).toEqual({
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
