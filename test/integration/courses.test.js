let server;
const { exportNamedDeclaration } = require("@babel/types");
const mongoose = require("mongoose");
const request = require("supertest");
const { Course } = require("../../models/Course");

describe("/api/courses", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Course.remove({});
  });

  describe("GET /", () => {
    Course.collection.insertMany([
      { title: "Course1", imageUri: "image1", coordinator: "coordinator1" },
      { title: "Course2", imageUri: "image2", coordinator: "coordinator2" },
    ]);

    it("should return all the courses", async () => {
      const res = await request(server).get("/api/courses");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.title === "Course1")).toBeTruthy();
      expect(res.body.some((c) => c.title === "Course2")).toBeTruthy();
    });
  });

  describe("GET /:Id", () => {
    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/courses/a");

      expect(res.status).toBe(404);
    });

    it("should return 404 if course is not found", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/courses/" + id);

      expect(res.status).toBe(404);
    });

    it("should return 200 if course is found", async () => {
      const course = new Course({
        title: "Course 1",
        imageUri: "image",
        coordinator: "Coordinator",
      });

      await course.save();

      const res = await request(server).get("/api/courses/" + course._id);

      expect(res.status).toBe(200);
    });
  });

  describe("POST /", () => {
    let payload;

    beforeEach(() => {
      payload = {
        title: "New Course",
        imageUri: "image",
        coordinator: "coordinatorId",
      };
    });

    function exec() {
      return request(server).post("/api/courses/").send(payload);
    }

    it("it should return 400 if no title is provided", async () => {
      delete payload.title;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("it should return 400 if course title is less thatn 3 characters", async () => {
      payload.title = "a";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if course title is more that 100 characters", async () => {
      payload.title = new Array(102).join("*");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the course", async () => {
      await exec();

      const courseInDb = await Course.findOne({ title: payload.title });

      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toMatchObject(payload);
    });

    it("should save should return the course", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", payload.title);
    });
  });

  describe("PATCH /:id", () => {
    let payload;

    beforeEach(() => {
      payload = {
        title: "New Course",
        imageUri: "image",
        coordinator: "coordinatorId",
      };
    });

    function exec() {
      request(server).patch("/api/courses").send(payload);
    }

    it("should return 404 if id is not passed", async () => {
      const res = await exec();
    });
  });
});
