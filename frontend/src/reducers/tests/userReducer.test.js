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
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  ADMIN_USER_UPDATE_REQUEST,
  ADMIN_USER_UPDATE_SUCCESS,
  ADMIN_USER_UPDATE_FAIL,
  ADMIN_USER_UPDATE_RESET,
} from "../../constants/userConstants";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  adminUserUpdateReducer,
} from "../userReducers";
import userInfo from "../../mockData/user";

describe("userUpdateProfileReducer test", () => {
  it("should return empty state", () => {
    expect(userUpdateProfileReducer(undefined, {})).toEqual({});
  });

  it("should return loading state", () => {
    expect(
      userUpdateProfileReducer(undefined, {
        type: USER_UPDATE_PROFILE_REQUEST,
      })
    ).toEqual({
      loading: true,
    });
  });

  it("should successfully update user profile", () => {
    const previousState = {
      user: { ...userInfo, name: "bob bobson" },
    };
    expect(
      userUpdateProfileReducer(previousState, {
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: userInfo,
      })
    ).toEqual({
      loading: false,
      success: true,
      userInfo: userInfo,
    });
  });

  it("should fail to update user profile", () => {
    const previousState = {
      user: userInfo,
    };
    expect(
      userUpdateProfileReducer(previousState, {
        type: USER_UPDATE_PROFILE_FAIL,
        payload: "Update failed",
      })
    ).toEqual({
      loading: false,
      error: "Update failed",
    });
    expect(previousState.user).toEqual(userInfo);
  });

  it("should reset user update state?", () => {
    expect(
      userUpdateProfileReducer(undefined, {
        type: USER_UPDATE_PROFILE_RESET,
      })
    ).toEqual({});
  });
});

describe("userDetailsReducer test", () => {
  it("should return empty state", () => {
    expect(userDetailsReducer(undefined, {})).toEqual({
      user: {},
    });
  });

  it("should return user details where there is already user info in state", () => {
    const previousState = {
      user: userInfo,
    };
    expect(
      userDetailsReducer(previousState, {
        type: USER_DETAILS_REQUEST,
      })
    ).toEqual({
      loading: true,
      user: userInfo,
    });
  });

  it("should return nothing when there are no users in state", () => {
    expect(
      userDetailsReducer(undefined, {
        type: USER_DETAILS_REQUEST,
      })
    ).toEqual({
      loading: true,
      user: {},
    });
  });

  it("should successfully get user details", () => {
    expect(
      userDetailsReducer(undefined, {
        type: USER_DETAILS_SUCCESS,
        payload: userInfo,
      })
    ).toEqual({
      loading: false,
      user: userInfo,
    });
  });

  it("should fail to register user", () => {
    expect(
      userDetailsReducer(undefined, {
        type: USER_DETAILS_FAIL,
        payload: "Unable to get user details",
      })
    ).toEqual({
      loading: false,
      error: "Unable to get user details",
    });
  });

  it("should reset user details", () => {
    const previousState = {
      user: userInfo,
    };
    expect(
      userDetailsReducer(previousState, {
        type: USER_DETAILS_RESET,
      })
    ).toEqual({
      user: {},
    });
  });
});

describe("userRegisterReducer test", () => {
  it("should return empty state", () => {
    expect(userRegisterReducer(undefined, {})).toEqual({});
  });

  it("should return loading as true", () => {
    expect(
      userRegisterReducer(undefined, {
        type: USER_REGISTER_REQUEST,
      })
    ).toEqual({
      loading: true,
    });
  });

  it("should successfully register user", () => {
    expect(
      userRegisterReducer(undefined, {
        type: USER_REGISTER_SUCCESS,
        payload: userInfo,
      })
    ).toEqual({
      loading: false,
      userInfo: userInfo,
    });
  });

  it("should fail to register user", () => {
    expect(
      userRegisterReducer(undefined, {
        type: USER_REGISTER_FAIL,
        payload: "User with this email exists",
      })
    ).toEqual({
      loading: false,
      error: "User with this email exists",
    });
  });
});

describe("userLoginReducer test", () => {
  it("should return empty state", () => {
    expect(userLoginReducer(undefined, {})).toEqual({});
  });

  it("should return loading as true", () => {
    expect(
      userLoginReducer(undefined, {
        type: USER_LOGIN_REQUEST,
      })
    ).toEqual({
      loading: true,
    });
  });

  it("should log user in", () => {
    expect(
      userLoginReducer(undefined, {
        type: USER_LOGIN_SUCCESS,
        payload: userInfo,
      })
    ).toEqual({
      loading: false,
      userInfo: userInfo,
    });
  });

  it("should fail to log user in", () => {
    expect(
      userLoginReducer(undefined, {
        type: USER_LOGIN_FAIL,
        payload: "No user found",
      })
    ).toEqual({
      loading: false,
      error: "No user found",
    });
  });

  it("should log user out", () => {
    const previousState = {
      userInfo: userInfo,
    };
    expect(
      userLoginReducer(previousState, {
        type: USER_LOGOUT,
      })
    ).toEqual({});
  });
});

describe("userListReducer test", () => {
  it("should return loading as true", () => {
    expect(
      userListReducer(undefined, {
        type: USER_LIST_REQUEST,
      })
    ).toEqual({
      loading: true,
    });
  });

  it("should return state with users", () => {
    expect(
      userListReducer(undefined, {
        type: USER_LIST_SUCCESS,
        payload: [{ user: "user1" }, { user: "user2" }],
      })
    ).toEqual({
      loading: false,
      users: [{ user: "user1" }, { user: "user2" }],
    });
  });

  it("should fail to get users list", () => {
    expect(
      userListReducer(undefined, {
        type: USER_LIST_FAIL,
        payload: "Not authorized",
      })
    ).toEqual({
      loading: false,
      error: "Not authorized",
    });
  });

  it("should reset user list", () => {
    expect(
      userListReducer(undefined, {
        type: USER_LIST_RESET,
      })
    ).toEqual({ users: [] });
  });
});

describe("userDeleteReducer test", () => {
  it("should request to delete user", () => {
    expect(
      userDeleteReducer(undefined, {
        type: USER_DELETE_REQUEST,
      })
    ).toEqual({
      loading: true,
    });
  });

  it("should return id of user deleted", () => {
    expect(
      userDeleteReducer(undefined, {
        type: USER_DELETE_SUCCESS,
        payload: 1,
      })
    ).toEqual({
      loading: false,
      success: true,
    });
  });

  it("should fail to delete user", () => {
    expect(
      userDeleteReducer(undefined, {
        type: USER_DELETE_FAIL,
        payload: "Not authorized",
      })
    ).toEqual({ error: "Not authorized", loading: false });
  });
});

describe("adminUserUpdateReducer test", () => {
  it("should request to update user", () => {
    expect(
      adminUserUpdateReducer(undefined, {
        type: ADMIN_USER_UPDATE_REQUEST,
      })
    ).toEqual({
      loading: true,
    });
  });

  it("should update user state", () => {
    expect(
      adminUserUpdateReducer(undefined, {
        type: ADMIN_USER_UPDATE_SUCCESS,
        payload: userInfo,
      })
    ).toEqual({
      loading: false,
      success: true,
    });
  });

  it("should fail to update user", () => {
    expect(
      adminUserUpdateReducer(undefined, {
        type: ADMIN_USER_UPDATE_FAIL,
        payload: "Not authorized",
      })
    ).toEqual({ error: "Not authorized", loading: false });
  });

  it("should reset update user state", () => {
    expect(
      adminUserUpdateReducer(undefined, {
        type: ADMIN_USER_UPDATE_RESET,
      })
    ).toEqual({ user: {} });
  });
});
