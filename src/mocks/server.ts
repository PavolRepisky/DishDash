import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { DonationItem } from "../donor/types/DonationItem";
import activityLogs from "./activityLogs.json";
import donations from "./donations.json";
import notifications from "./notifications.json";
import reservations from "./reservations.json";
import users from "./users.json";

const now = Date.now();

function generateId() {
  return (Math.floor(Math.random() * 10000) + 1).toString();
}

function generateToken(length: number): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    token += characters.charAt(randomIndex);
  }

  return token;
}

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios, { delayResponse: 100 });

// Landing
mock.onPost("/api/message").reply(200);

// Auth
mock.onPost("/api/register").reply((config) => {
  const data = JSON.parse(config.data);
  const user = { ...data };

  user.id = generateId();
  user.token = generateToken(14);

  return [201, user];
});
mock.onPost("/api/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    user.password = "";
    return [200, user];
  } else {
    return [401, { error: "Invalid credentials" }];
  }
});
mock.onPost("/api/logout").reply(200);
mock.onPut("/api/password").reply(({ data }) => [200, data]);
mock.onPost("/api/forgot-password").reply((config) => {
  const { email } = JSON.parse(config.data);

  const user = users.find((user) => user.email === email);

  if (user) {
    return [200];
  } else {
    return [400];
  }
});
mock.onPost("/api/forgot-password-submit").reply(400);

// Activity
mock.onGet("/api/activity").reply(200, activityLogs);

// Notifications
mock.onGet("/api/notifications").reply(200, notifications);

// User
mock.onGet("/api/user").reply((config) => {
  const { key } = config.params;
  const user = users.find((user) => user.token === key);

  if (key && user) {
    return [200, user];
  } else {
    return [404, { error: "User not found" }];
  }
});
mock.onPut("/api/user").reply(({ data }) => [200, data]);

// Donations
mock.onDelete("/api/donations").reply(({ data }) => [200, data]);
mock.onGet(/\/api\/donations\/\d+/).reply((config) => {
  const id = config.url?.split("/").pop() ?? "";
  const donationData = donations.find((donation) => donation.id === id);

  return [200, donationData];
});
mock.onGet("/api/donations").reply(200, donations);
mock.onPost("/api/donations").reply((config) => {
  let data = JSON.parse(config.data);
  data.items.map((item: DonationItem) => {
    return { ...item, id: generateId() };
  });

  const newData = {
    ...data,
    id: generateId(),
    active: true,
    createdAt: new Date().toISOString(),
  };
  return [201, newData];
});
mock.onPut("/api/donations").reply((config) => {
  return [200, config.data];
});

// Reservations
mock.onDelete("/api/reservations").reply(({ data }) => [200, data]);
mock.onGet("/api/reservations").reply(200, reservations);
mock.onPost("/api/reservations").reply((config) => {
  const newData = {
    ...JSON.parse(config.data),
    id: generateId(),
    active: true,
    createdAt: new Date().toISOString(),
  };
  return [201, newData];
});
mock.onPut("/api/reservations").reply((config) => {
  return [200, config.data];
});
