import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  login,
  logout,
  register,
  getUserDetails,
  updateUserProfile,
} from "../userActions";
import userInfo from "../../mockData/user";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
} from "../../constants/userConstants";
import { MY_ORDERS_LIST_RESET } from "../../constants/orderConstants";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const mock = new MockAdapter(axios);
const store = mockStore();

describe("update user profile test", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("should successfully update user details", async () => {
    const store = mockStore({ userLogin: { userInfo: userInfo } });
    mock.onPut("/api/users/profile/update/").reply(200, userInfo);
    await store
      .dispatch(
        updateUserProfile({
          id: 2,
          name: "bob bobson",
          email: "bob@email.com",
          password: "",
        })
      )
      .then(() => {
        let expectedActions = [
          { type: USER_UPDATE_PROFILE_REQUEST },
          { type: USER_UPDATE_PROFILE_SUCCESS, payload: userInfo },
          { type: USER_LOGIN_SUCCESS, payload: userInfo },
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should fail to update user details", async () => {
    const store = mockStore({ userLogin: { userInfo: userInfo } });
    mock
      .onPut("/api/users/profile/update/")
      .reply(400, { details: "user profile update failed" });
    await store
      .dispatch(
        updateUserProfile({
          id: 2,
          name: "bob bobson",
          email: "bob@email.com",
          password: "",
        })
      )
      .then(() => {
        let expectedActions = [
          { type: USER_UPDATE_PROFILE_REQUEST },
          {
            type: USER_UPDATE_PROFILE_FAIL,
            payload: "Request failed with status code 400",
          },
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});

describe("test user details", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("should get user details", async () => {
    const store = mockStore({ userLogin: { userInfo: userInfo } });
    mock.onGet("/api/users/profile/").reply(200, userInfo);
    await store.dispatch(getUserDetails(1)).then(() => {
      let expectedActions = [
        { type: USER_DETAILS_REQUEST },
        { type: USER_DETAILS_SUCCESS, payload: userInfo },
      ];
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should fail to get user details", async () => {
    const store = mockStore({ userLogin: { userInfo: userInfo } });
    mock.onGet("/api/users/profile/").reply(400, { details: "Invalid token" });
    await store.dispatch(getUserDetails(1)).then(() => {
      let expectedActions = [
        { type: USER_DETAILS_REQUEST },
        {
          type: USER_DETAILS_FAIL,
          payload: "Request failed with status code 400",
        },
      ];
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe("test user registration", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("should register", async () => {
    const store = mockStore({ userLogin: {} });
    mock.onPost("/api/users/register/").reply(200, userInfo);
    await store
      .dispatch(register("john doe", "john@email.com", "coolPassword123"))
      .then(() => {
        let expectedActions = [
          { type: USER_REGISTER_REQUEST },
          {
            payload: userInfo,
            type: USER_REGISTER_SUCCESS,
          },
          {
            payload: userInfo,
            type: USER_LOGIN_SUCCESS,
          },
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should fail to register user", async () => {
    const store = mockStore({ userLogin: {} });
    mock
      .onPost("/api/users/register/")
      .reply(400, { detail: "Email is already in use" });
    await store
      .dispatch(register("john doe", "john@email.com", "coolPassword"))
      .then(() => {
        let expectedActions = [
          { type: USER_REGISTER_REQUEST },
          {
            type: USER_REGISTER_FAIL,
            payload: "Email is already in use",
          },
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});

describe("test user login and logout", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("should log user in", async () => {
    const store = mockStore({ userLogin: {} });
    mock.onPost("/api/users/login/").reply(200, userInfo);
    await store
      .dispatch(login("john@email.com", "coolPassword123"))
      .then(() => {
        let expectedActions = [
          { type: USER_LOGIN_REQUEST },
          {
            payload: userInfo,
            type: USER_LOGIN_SUCCESS,
          },
        ];
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should fail to log in user", async () => {
    const store = mockStore({ userLogin: {} });
    mock
      .onPost("/api/users/login/")
      .reply(400, { detail: "Email or password is wrong" });
    await store.dispatch(login("john@email.com", "coolPassword")).then(() => {
      let expectedActions = [
        { type: USER_LOGIN_REQUEST },
        {
          type: USER_LOGIN_FAIL,
          payload: "Email or password is wrong",
        },
      ];
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("should log user out", async () => {
    const store = mockStore({ user: { userInfo: userInfo } });
    await store.dispatch(logout()).then(() => {
      let expectedActions = [
        { type: USER_LOGOUT },
        { type: USER_DETAILS_RESET },
        { type: MY_ORDERS_LIST_RESET },
      ];
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
