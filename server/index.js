const Hapi = require("hapi");
const Boom = require("boom");
const Path = require("path");
const Inert = require("inert");

if (process.env.NODE_ENV !== "production") require("dotenv").config();
console.log(Path.join(__dirname, "../build"));
const launchServer = async function() {
  const dbOpts = {
    url: process.env.MONGO_DB_URL,
    settings: {
      poolSize: 10,
      useNewUrlParser: true
    },
    decorate: true
  };

  const server = Hapi.server({
    host: "0.0.0.0",
    port: +process.env.PORT
  });

  await server.register(Inert);
  await server.register({
    plugin: require("hapi-mongodb"),
    options: dbOpts
  });
  server.route({
    method: "GET",
    path: "/{path*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "../build"),
        listing: false,
        index: true
      }
    }
  });

  server.route({
    method: "GET",
    path: "/api/users",
    async handler(request, reply) {
      const db = request.mongo.db;

      try {
        const result = await db
          .collection("nomadCities")
          .find()
          .toArray();
        return result;
      } catch (err) {
        console.log(err);
        throw Boom.internal("Internal MongoDB error", err);
      }
    }
  });
  // Redirect all http requests to https if in production
  /* eslint-disable consistent-return */
  if (process.env.NODE_ENV === "production") {
    server.ext("onRequest", (request, reply) => {
      if (request.headers["x-forwarded-proto"] !== "https") {
        return reply("Forwarding to secure route").redirect(
          `https://${request.headers.host}${request.path}${request.url.search}`
        );
      }
      reply.continue();
    });
  }
  // // Setting index.html as the default
  // server.ext("onPreResponse", (request, reply) => {
  //   const response = request.response;
  //
  //   if (!response.isBoom) {
  //     return reply.continue();
  //   }
  //
  //   // else an error has occurred
  //   const error = response;
  //
  //   // if the error is 'Object not found', call index.html
  //   if (error.output.statusCode === 404) {
  //     return reply.file("index.html");
  //   }
  // });
  /* eslint-enable consistent-return */

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch(err => {
  console.error(err);
  process.exit(1);
});
