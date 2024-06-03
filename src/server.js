import "dotenv/config";

import express from "express";
const app = express();

import { config } from "./config.js";
import { logError, logInfo } from "./utils/logger.js";

import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import favicon from "serve-favicon";

app.use(helmet(config.helmet));
app.use(compression()); // USE THE DEFAULTS 

app.set("view engine", "pug");
app.set("views", config.paths.views);

app.use(express.static(config.paths.public, { maxAge: 31536000 }));
app.use(favicon(config.paths.favicon));

app.use(bodyParser.urlencoded({ extended: config.bodyParser.extended }));
app.use(bodyParser.json({ limit: config.bodyParser.limit }));
app.disable("x-powered-by");

/*
  SYNCDATA
  KEMZO NOTE: IT'S USELESS WITHOUT MANY UPDATES PUSHED TO THE DATA REPO (IN THE CURRENT MOMENT).
*/
// import { syncData, dataCheck } from "./utils/syncData.js";
// await syncData();
// await dataCheck();

app.use((req, res, next) => {
  res.locals.website_name = config.website_name;
  res.locals.MainPreview = config.preview;
  res.locals.email = config.contact.email;
  res.locals.tiktok = config.contact.tiktok;
  res.locals.telegram = config.contact.telegram;
  res.locals.instagram = config.contact.instagram;
  res.locals.phone = config.contact.phone;
  next();
});

/* HOME */
app.get("/", (req, res, next) => {
  res.render("home", {
    options: {
      title: `${config.website_name} - منصة شاملة للقرآن والأذكار والأحاديث والتفاسير والمحتوى الإسلامي`,
      keywords: [
        "إسلام",
        "قرآن",
        "أذكار",
        "أحاديث",
        "منصة إسلامية",
        "فتاوى",
        "أوقات الصلاة",
        "تفسير",
        "مسبحة",
      ],
      description: `${config.website_name} هي منصة إسلامية شاملة تهدف إلى توفير القرآن الكريم والأذكار والأحاديث وغيرها من المحتوى الإسلامي بطريقة سهلة ومنظمة. توفر المنصة مجموعة واسعة من الموارد الدينية والتعليمية للمسلمين، استكشف ${config.website_name} اليوم واستفد من محتواه القيم والموثوق.`,
    },
  });
});

/* PAGES ROUTES */
import adhkar from "./routes/adhkar.js";
app.use("/", adhkar);

import fatwas from "./routes/fatwas.js";
app.use("/", fatwas);

import hisnmuslim from "./routes/hisnmuslim.js";
app.use("/", hisnmuslim);

import history from "./routes/history.js";
app.use("/", history);

import prayer from "./routes/prayer.js";
app.use("/", prayer);

import quran from "./routes/quran.js";
app.use("/", quran);

import radio from "./routes/radio.js";
app.use("/", radio);

import sabha from "./routes/sabha.js";
app.use("/", sabha);

import tafsir from "./routes/tafsir.js";
app.use("/", tafsir);

/* ERROR ROUTER */
import errorRouter from "./routes/error.js";
app.use("/", errorRouter);

/* INTERNAL SERVER ERROR */
app.use((err, req, res, next) => {
  logError(err.message);
  res.status(500).render("error", {
    options: {
      title: "خطأ في الخادم الداخلي 500",
      keywords: [
        "صفحة الخطأ 500",
        "عنوان URL غير صحيح",
        "عنوان URL غير موجود",
        "error",
        "500",
        "لم يتم العثور على الصفحة",
        "صفحة غير موجودة",
        "صفحة غير متاحة",
        "رسالة الخطأ 500",
        "خطأ في الخادم الداخلي",
      ],
      description: `صفحة الخطأ 500 تعني "خطأ في الخادم الداخلي" وتظهر عندما يحدث خطأ تقني داخل الخادم يعيقه عن معالجة الطلب بشكل صحيح.`,
      status: 500,
      errorTitle: "خطأ في الخادم الداخلي",
    },
  });
});

/* NOT FOUND */
app.use((req, res, next) => {
  res.status(404).render("error", {
    options: {
      title: `الصفحة غير موجودة 404`,
      keywords: [
        "صفحة الخطأ 404",
        "عنوان URL غير صحيح",
        "عنوان URL غير موجود",
        "error",
        "404",
        "لم يتم العثور على الصفحة",
        "صفحة غير موجودة",
        "صفحة غير متاحة",
        "رسالة الخطأ 404",
      ],
      description:
        "صفحة الخطأ 404 هي صفحة تظهر عندما يتم الوصول إلى عنوان URL غير صحيح أو غير موجود. تهدف هذه الصفحة إلى إعلام المستخدم بأن الصفحة التي يحاول الوصول إليها غير متاحة.",
      status: 404,
      errorTitle: "الصفحة غير موجودة",
    },
  });
});

const server = app.listen(config.port, () => {
  console.log(`[Kanzislam] Server started on port ${config.port}`);
});

function sigHandle(signal) {
  logInfo(`${signal} signal received.`);
  server.close((err) => {
    if (err) {
      console.error("[Kanzislam] Error closing server:", err);
    } else {
      console.log("[Kanzislam] Server closed.");
      process.exit(0); // Explicitly exit the process after the server is closed
    }
  });
}

process.on("SIGINT", sigHandle);
process.on("SIGTERM", sigHandle);
