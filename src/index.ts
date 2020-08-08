// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { AddressInfo } from "net";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import { typeDefs, resolvers } from "./lib/graphql";
import { connectDatabase } from "./db";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());

  app.use(express.static(`${__dirname}/client`));
  app.get("/*", (_req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: "/api" });

  const listen = app.listen(process.env.PORT, () => {
    const host = listen.address() as AddressInfo;
    console.log(`[app]: http://localhost:${host.port}${server.graphqlPath}`);
  });
};

mount(express());
