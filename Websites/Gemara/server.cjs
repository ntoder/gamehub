var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/mockAnalyses.ts
var mockAnalyses = {
  "bava-metzia-2a": {
    title: "Two Holding a Garment / \u05E9\u05E0\u05D9\u05DD \u05D0\u05D5\u05D7\u05D6\u05D9\u05DF \u05D1\u05D8\u05DC\u05D9\u05EA",
    tractate: "Bava Metzia 2a",
    category: "Mishna (\u05DE\u05E9\u05E0\u05D4)",
    sages: [
      {
        nameEn: "The Tannaic Sages (Anonymous)",
        nameHe: "\u05EA\u05E0\u05D0\u05D9 \u05D4\u05DE\u05E9\u05E0\u05D4 (\u05E1\u05EA\u05DD \u05DE\u05E9\u05E0\u05D4)",
        role: "Tannaim",
        descriptionEn: "The foundational generation of Rabbinic scholars who compiled the Jewish oral laws and principles from the 1st to the 3rd Century CE.",
        descriptionHe: "\u05D4\u05D3\u05D5\u05E8 \u05D4\u05DE\u05D9\u05D9\u05E1\u05D3 \u05E9\u05DC \u05D7\u05DB\u05DE\u05D9 \u05D4\u05EA\u05D5\u05E8\u05D4 \u05E9\u05D1\u05E2\u05DC \u05E4\u05D4 \u05E9\u05E2\u05E8\u05DB\u05D5 \u05D0\u05EA \u05E7\u05D5\u05D1\u05E5 \u05D4\u05DE\u05E9\u05E0\u05D9\u05D5\u05EA \u05D5\u05D4\u05D4\u05DC\u05DB\u05D5\u05EA \u05D4\u05D1\u05E1\u05D9\u05E1\u05D9\u05D5\u05EA \u05E9\u05DC \u05D4\u05E2\u05DD \u05D4\u05D9\u05D4\u05D5\u05D3\u05D9."
      }
    ],
    keywords: [
      {
        term: "\u05EA\u05E0\u05DF",
        meaningEn: "We learned in a Mishnaic text",
        meaningHe: "\u05E9\u05E0\u05D9\u05E0\u05D5 \u05D1\u05DE\u05E9\u05E0\u05D4",
        functionEn: "Cites a primary Mishnaic rule to establish a baseline law",
        functionHe: "\u05E6\u05D9\u05D8\u05D5\u05D8 \u05DE\u05E7\u05D5\u05E8 \u05DE\u05E9\u05E0\u05D0\u05D9 \u05DE\u05D5\u05E1\u05DE\u05DA \u05D4\u05DE\u05E9\u05DE\u05E9 \u05DB\u05D1\u05E1\u05D9\u05E1 \u05D4\u05D4\u05DC\u05DB\u05EA\u05D9"
      },
      {
        term: "\u05D9\u05E9\u05D1\u05E2",
        meaningEn: "Shall swear an oath",
        meaningHe: "\u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05E9\u05D1\u05E2 \u05E9\u05D1\u05D5\u05E2\u05D4",
        functionEn: "Indicates a court-enforced rabbinic oath to resolve disputed claims under physical holding",
        functionHe: "\u05E6\u05D9\u05D5\u05DF \u05D7\u05D9\u05D5\u05D1 \u05E9\u05D1\u05D5\u05E2\u05D4 \u05D4\u05DE\u05D5\u05D8\u05DC \u05E2\u05DC \u05D9\u05D3\u05D9 \u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF \u05DB\u05D3\u05D9 \u05DC\u05EA\u05EA \u05EA\u05D5\u05E7\u05E3 \u05DE\u05E9\u05E4\u05D8\u05D9 \u05DC\u05D7\u05DC\u05D5\u05E7\u05EA \u05D4\u05E0\u05DB\u05E1"
      },
      {
        term: "\u05D5\u05D9\u05D7\u05DC\u05D5\u05E7\u05D5",
        meaningEn: "And they shall divide it",
        meaningHe: "\u05D5\u05D9\u05D7\u05DC\u05E7\u05D5 \u05D0\u05EA \u05E9\u05D5\u05D5\u05D9\u05D4",
        functionEn: "Instructs a proportional equitable split of properties in dispute",
        functionHe: "\u05D4\u05D5\u05E8\u05D0\u05D4 \u05DC\u05D1\u05E6\u05E2 \u05D7\u05DC\u05D5\u05E7\u05D4 \u05E9\u05D5\u05D5\u05D9\u05D5\u05E0\u05D9\u05EA \u05D0\u05D5 \u05D9\u05D7\u05E1\u05D9\u05EA \u05D1\u05E0\u05DB\u05E1 \u05D4\u05E9\u05E0\u05D5\u05D9 \u05D1\u05DE\u05D7\u05DC\u05D5\u05E7\u05EA"
      }
    ],
    discussionFlow: [
      {
        stepNumber: 1,
        stageEn: "Case Description (\u05DE\u05D9\u05DE\u05E8\u05D0)",
        stageHe: "\u05D4\u05E6\u05D2\u05EA \u05D4\u05DE\u05E7\u05E8\u05D4",
        detailsEn: "Presents the baseline scenario where two individuals are physically gripping helper single garment, and both claim full exclusive ownership of its discovery.",
        detailsHe: "\u05D4\u05E6\u05D2\u05EA \u05D4\u05E1\u05D9\u05D8\u05D5\u05D0\u05E6\u05D9\u05D4 \u05E9\u05D1\u05D4 \u05E9\u05E0\u05D9 \u05D0\u05E0\u05E9\u05D9\u05DD \u05D0\u05D5\u05D7\u05D6\u05D9\u05DD \u05E4\u05D9\u05D6\u05D9\u05EA \u05D1\u05D8\u05DC\u05D9\u05EA \u05D0\u05D7\u05EA, \u05D5\u05DB\u05DC \u05D0\u05D7\u05D3 \u05DE\u05D4\u05DD \u05D8\u05D5\u05E2\u05DF \u05E9\u05DC\u05D7\u05DC\u05D5\u05D8\u05D9\u05DF \u05D4\u05D5\u05D0 \u05D6\u05D4 \u05E9\u05DE\u05E6\u05D0 \u05D0\u05D5\u05EA\u05D4 \u05E8\u05D0\u05E9\u05D5\u05DF."
      },
      {
        stepNumber: 2,
        stageEn: "Judicial Solution (\u05EA\u05E9\u05D5\u05D1\u05D4)",
        stageHe: "\u05D4\u05D5\u05E8\u05D0\u05EA \u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF",
        detailsEn: "The court mandates an oath for each claimant certifying their claim to at least half, and then commands an equal split of the garment's value.",
        detailsHe: "\u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF \u05DE\u05D8\u05D9\u05DC \u05E9\u05D1\u05D5\u05E2\u05D4 \u05E2\u05DC \u05E9\u05E0\u05D9 \u05D4\u05E6\u05D3\u05D3\u05D9\u05DD \u05E9\u05D4\u05DD \u05D6\u05DB\u05D0\u05D9\u05DD \u05DC\u05E4\u05D7\u05D5\u05EA \u05DC\u05D7\u05E6\u05D9, \u05D5\u05DC\u05D0\u05D7\u05E8 \u05DE\u05DB\u05DF \u05DE\u05D7\u05DC\u05E7 \u05D0\u05EA \u05E9\u05D5\u05D5\u05D9 \u05D4\u05D8\u05DC\u05D9\u05EA \u05E9\u05D5\u05D5\u05D4 \u05D1\u05E9\u05D5\u05D5\u05D4 \u05D1\u05D9\u05E0\u05D9\u05D4\u05DD."
      },
      {
        stepNumber: 3,
        stageEn: "Asymmetric Dispute (\u05DE\u05D9\u05DE\u05E8\u05D0)",
        stageHe: "\u05DE\u05E7\u05E8\u05D4 \u05DE\u05D5\u05E8\u05DB\u05D1",
        detailsEn: "Presents a secondary, asymmetric case where one claimant claims 100% of the garment (\u05E9\u05DC\u05D9 \u05DB\u05D5\u05DC\u05D4) and the other claims only 50% (\u05E9\u05DC\u05D9 \u05D7\u05E6\u05D9\u05D4).",
        detailsHe: "\u05D4\u05E6\u05D2\u05EA \u05DE\u05E7\u05E8\u05D4 \u05E9\u05E0\u05D9 \u05E9\u05D0\u05D9\u05E0\u05D5 \u05E1\u05D9\u05DE\u05D8\u05E8\u05D9: \u05D0\u05D7\u05D3 \u05D8\u05D5\u05E2\u05DF \u05DC\u05D1\u05E2\u05DC\u05D5\u05EA \u05DE\u05D5\u05D7\u05DC\u05D8\u05EA (100%), \u05D5\u05D4\u05E9\u05E0\u05D9 \u05D8\u05D5\u05E2\u05DF \u05E8\u05E7 \u05DC\u05DE\u05D7\u05E6\u05D9\u05EA \u05DE\u05D4\u05D8\u05DC\u05D9\u05EA (50%)."
      },
      {
        stepNumber: 4,
        stageEn: "Proportional Split (\u05EA\u05D9\u05E8\u05D5\u05E5)",
        stageHe: "\u05D1\u05D9\u05E8\u05D5\u05E8 \u05D9\u05D7\u05E1\u05D9 \u05D5\u05D7\u05DC\u05D5\u05E7\u05D4",
        detailsEn: "The school of law breaks up the contested portion proportionally. Since the second claimant concedes 50% to the first, they only divide the contested 50%. The first gets 75% and the second gets 25%.",
        detailsHe: "\u05D4\u05DB\u05E8\u05E2\u05D4 \u05DE\u05EA\u05DE\u05D8\u05D9\u05EA-\u05DC\u05D5\u05D2\u05D9\u05EA: \u05DE\u05D9 \u05E9\u05DE\u05D5\u05D3\u05D4 \u05E9\u05D4\u05D7\u05E6\u05D9 \u05E9\u05D9\u05D9\u05DA \u05DC\u05D9\u05E8\u05D9\u05D1\u05D5 \u05EA\u05D5\u05D1\u05E2 \u05E8\u05E7 \u05E8\u05D1\u05E2 (\u05D7\u05E6\u05D9 \u05DE\u05D7\u05E6\u05D9 \u05D4\u05D5\u05D5\u05D9\u05DB\u05D5\u05D7), \u05D5\u05D4\u05E8\u05D0\u05E9\u05D5\u05DF \u05DE\u05E7\u05D1\u05DC 3/4 \u05D5\u05D4\u05E9\u05E0\u05D9 \u05E8\u05D1\u05E2."
      }
    ],
    lineByLine: [
      {
        original: "\u05EA\u05E0\u05DF: \u05E9\u05E0\u05D9\u05DD \u05D0\u05D5\u05D7\u05D6\u05D9\u05DF \u05D1\u05D8\u05DC\u05D9\u05EA, \u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05D0\u05E0\u05D9 \u05DE\u05E6\u05D0\u05EA\u05D9\u05D4' \u05D5\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05D0\u05E0\u05D9 \u05DE\u05E6\u05D0\u05EA\u05D9\u05D4'",
        translationEn: "We learned in a Mishna: Two people are walking along and holding a single garment, and this one claims 'I found it!' and that one claims 'I found it!'",
        translationHe: "\u05E9\u05E0\u05D9\u05E0\u05D5 \u05D1\u05DE\u05E9\u05E0\u05D4: \u05E9\u05E0\u05D9 \u05D1\u05E0\u05D9 \u05D0\u05D3\u05DD \u05D0\u05D5\u05D7\u05D6\u05D9\u05DD \u05D9\u05D7\u05D3\u05D9\u05D5 \u05D1\u05D8\u05DC\u05D9\u05EA \u05D0\u05D7\u05EA, \u05D5\u05D6\u05D4 \u05D8\u05D5\u05E2\u05DF '\u05D0\u05E0\u05D9 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D0\u05D5\u05EA\u05D4 \u05E8\u05D0\u05E9\u05D5\u05DF' \u05D5\u05D6\u05D4 \u05D8\u05D5\u05E2\u05DF '\u05D0\u05E0\u05D9 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05D0\u05D5\u05EA\u05D4 \u05E8\u05D0\u05E9\u05D5\u05DF'",
        commentaryEn: "The Mishna starts by presenting a direct, simultaneous possession and conflicting claim over ownerless property, where both assert exclusive finding rights.",
        commentaryHe: "\u05D4\u05DE\u05E9\u05E0\u05D4 \u05E4\u05D5\u05EA\u05D7\u05EA \u05D1\u05D4\u05E6\u05D2\u05EA \u05DE\u05E7\u05E8\u05D4 \u05E9\u05DC \u05EA\u05E4\u05D9\u05E1\u05D4 \u05E1\u05D9\u05DE\u05D5\u05DC\u05D8\u05E0\u05D9\u05EA \u05D5\u05E1\u05D5\u05EA\u05E8\u05EA \u05D1\u05E0\u05DB\u05E1 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05E2\u05DC\u05D9\u05DD (\u05DE\u05E6\u05D9\u05D0\u05D4), \u05DB\u05D0\u05E9\u05E8 \u05E9\u05E0\u05D9\u05D4\u05DD \u05D8\u05D5\u05E2\u05E0\u05D9\u05DD \u05DC\u05D1\u05E2\u05DC\u05D5\u05EA \u05E8\u05D0\u05E9\u05D5\u05E0\u05D9\u05EA \u05D5\u05D1\u05DC\u05E2\u05D3\u05D9\u05EA.",
        talmudicType: "\u05DE\u05D9\u05DE\u05E8\u05D0"
      },
      {
        original: "\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9' \u05D5\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9' -",
        translationEn: "This one claims 'It is entirely mine!' and that one claims 'It is entirely mine!'",
        translationHe: "\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9 \u05D4\u05D9\u05D0' \u05D5\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9 \u05D4\u05D9\u05D0' -",
        commentaryEn: "Each party asserts absolute and total ownership of the entire object, denying the other any share.",
        commentaryHe: "\u05DB\u05DC \u05E6\u05D3 \u05EA\u05D5\u05D1\u05E2 \u05D1\u05E2\u05DC\u05D5\u05EA \u05DE\u05DC\u05D0\u05D4 \u05D5\u05DE\u05D5\u05D7\u05DC\u05D8\u05EA \u05E2\u05DC \u05D4\u05D8\u05DC\u05D9\u05EA \u05DB\u05D5\u05DC\u05D4, \u05D5\u05DE\u05DB\u05D7\u05D9\u05E9 \u05DB\u05DC \u05D7\u05DC\u05E7 \u05E9\u05DC \u05D4\u05E6\u05D3 \u05D4\u05E9\u05E0\u05D9.",
        talmudicType: "\u05DE\u05D9\u05DE\u05E8\u05D0"
      },
      {
        original: "\u05D6\u05D4 \u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05D7\u05E6\u05D9\u05D4, \u05D5\u05D6\u05D4 \u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05D7\u05E6\u05D9\u05D4, \u05D5\u05D9\u05D7\u05DC\u05D5\u05E7\u05D5.",
        translationEn: "This one must take an oath that he owns no less than half of it, and that one must take an oath that he owns no less than half of it, and they divide it.",
        translationHe: "\u05D6\u05D4 \u05D9\u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05D7\u05E6\u05D9\u05D4, \u05D5\u05D6\u05D4 \u05D9\u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05D7\u05E6\u05D9\u05D4, \u05D5\u05D9\u05D7\u05DC\u05E7\u05D5 \u05D0\u05EA \u05D3\u05DE\u05D9\u05D4.",
        commentaryEn: "Since they both hold the physical garment, the court imposes an oath (Shevuat Heiset/Mishnaic) and splits the property to prevent dishonest grabbers (the 'Yachloku' principle).",
        commentaryHe: "\u05DE\u05DB\u05D9\u05D5\u05D5\u05DF \u05E9\u05E9\u05E0\u05D9\u05D4\u05DD \u05DE\u05D5\u05D7\u05D6\u05E7\u05D9\u05DD \u05D1\u05D4 \u05E4\u05D9\u05D6\u05D9\u05EA, \u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF \u05DE\u05D8\u05D9\u05DC \u05E2\u05DC\u05D9\u05D4\u05DD \u05E9\u05D1\u05D5\u05E2\u05D4 (\u05E9\u05DE\u05D0 \u05E8\u05DE\u05D0\u05D9 \u05D4\u05D5\u05D0) \u05D5\u05DE\u05D7\u05DC\u05E7 \u05D0\u05EA \u05D4\u05D7\u05E4\u05E5 \u05D7\u05E6\u05D9 \u05D1\u05D7\u05E6\u05D9 (\u05D3\u05D9\u05DF \u05D9\u05D7\u05DC\u05D5\u05E7\u05D5).",
        talmudicType: "\u05EA\u05E9\u05D5\u05D1\u05D4"
      },
      {
        original: "\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9' \u05D5\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05D7\u05E6\u05D9\u05D4 \u05E9\u05DC\u05D9' -",
        translationEn: "This one claims 'It is entirely mine!' and that one claims 'Half of it is mine!'",
        translationHe: "\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9 \u05D4\u05D9\u05D0' \u05D5\u05D6\u05D4 \u05D0\u05D5\u05DE\u05E8 '\u05D7\u05E6\u05D9 \u05DE\u05DE\u05E0\u05D4 \u05E9\u05D9\u05D9\u05DA \u05DC\u05D9' -",
        commentaryEn: "Here we have a partial admission or nested claim. One party claims 100% of the garment, while the other concedes 50% but claims the remaining 50% is theirs.",
        commentaryHe: "\u05DB\u05D0\u05DF \u05D9\u05E9 \u05DC\u05E0\u05D5 \u05DE\u05E7\u05E8\u05D4 \u05E9\u05DC \u05D4\u05D5\u05D3\u05D9\u05D4 \u05D1\u05DE\u05E7\u05E6\u05EA \u05D0\u05D5 \u05EA\u05D1\u05D9\u05E2\u05D4 \u05D9\u05D7\u05E1\u05D9\u05EA: \u05E6\u05D3 \u05D0\u05D7\u05D3 \u05EA\u05D5\u05D1\u05E2 100% \u05D5\u05D4\u05E6\u05D3 \u05D4\u05E9\u05E0\u05D9 \u05DE\u05D5\u05D5\u05EA\u05E8 \u05DE\u05E8\u05D0\u05E9 \u05E2\u05DC \u05D7\u05E6\u05D9 \u05D0\u05DA \u05EA\u05D5\u05D1\u05E2 \u05D0\u05EA \u05D4\u05D7\u05E6\u05D9 \u05D4\u05E9\u05E0\u05D9.",
        talmudicType: "\u05DE\u05D9\u05DE\u05E8\u05D0"
      },
      {
        original: "\u05D4\u05D0\u05D5\u05DE\u05E8 '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9' \u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05E9\u05DC\u05E9\u05D4 \u05D7\u05DC\u05E7\u05D9\u05DD,",
        translationEn: "The one who claimed 'It is entirely mine' must take an oath that he owns no less than three-quarters of it",
        translationHe: "\u05D4\u05D8\u05D5\u05E2\u05DF '\u05DB\u05D5\u05DC\u05D4 \u05E9\u05DC\u05D9' \u05D9\u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05E9\u05DC\u05D5\u05E9\u05D4 \u05D7\u05DC\u05E7\u05D9\u05DD (\u05E9\u05DC\u05D5\u05E9\u05EA \u05E8\u05D1\u05E2\u05D9 \u05E9\u05D5\u05D5\u05D9\u05D4)",
        commentaryEn: "The dispute is actually only over the half which is contested (the second half). Under this logical breakdown, the first claimant gets their undisputed half plus half of the disputed portion.",
        commentaryHe: "\u05DE\u05E4\u05E0\u05D9 \u05E9\u05D4\u05D5\u05D5\u05D9\u05DB\u05D5\u05D7 \u05D4\u05D5\u05D0 \u05D4\u05DC\u05DB\u05D4 \u05DC\u05DE\u05E2\u05E9\u05D4 \u05E8\u05E7 \u05E2\u05DC \u05D4\u05D7\u05E6\u05D9 \u05E9\u05E9\u05E0\u05D9\u05D4\u05DD \u05EA\u05D5\u05D1\u05E2\u05D9\u05DD (\u05D4\u05D7\u05E6\u05D9 \u05D4\u05E9\u05E0\u05D9 \u05D1\u05D8\u05DC\u05D9\u05EA). \u05DC\u05DB\u05DF \u05D4\u05D5\u05D0 \u05E0\u05E9\u05D1\u05E2 \u05E2\u05DC \u05E9\u05DC\u05D5\u05E9\u05D4 \u05E8\u05D1\u05E2\u05D9\u05DD \u05D5\u05E0\u05D5\u05D8\u05DC \u05D1\u05D4\u05EA\u05D0\u05DD.",
        talmudicType: "\u05EA\u05E9\u05D5\u05D1\u05D4"
      },
      {
        original: "\u05D5\u05D4\u05D0\u05D5\u05DE\u05E8 '\u05D7\u05E6\u05D9\u05D4 \u05E9\u05DC\u05D9' \u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05E8\u05D1\u05D9\u05E2, \u05D6\u05D4 \u05E0\u05D5\u05D8\u05DC \u05E9\u05DC\u05E9\u05D4 \u05D7\u05DC\u05E7\u05D9\u05DD \u05D5\u05D6\u05D4 \u05E0\u05D5\u05D8\u05DC \u05E8\u05D1\u05D9\u05E2.",
        translationEn: "And the one who claimed 'Half of it is mine' must take an oath that he owns no less than one-quarter of it; the former then receives three-quarters, and the latter receives one-quarter.",
        translationHe: "\u05D5\u05D4\u05D8\u05D5\u05E2\u05DF '\u05D7\u05E6\u05D9\u05D4 \u05E9\u05DC\u05D9' \u05D9\u05D9\u05E9\u05D1\u05E2 \u05E9\u05D0\u05D9\u05DF \u05DC\u05D5 \u05D1\u05D4 \u05E4\u05D7\u05D5\u05EA \u05DE\u05E8\u05D1\u05D9\u05E2, \u05D6\u05D4 \u05E0\u05D5\u05D8\u05DC \u05E9\u05DC\u05D5\u05E9\u05D4 \u05D7\u05DC\u05E7\u05D9\u05DD \u05D5\u05D6\u05D4 \u05E0\u05D5\u05D8\u05DC \u05E8\u05D1\u05D9\u05E2.",
        commentaryEn: "The second claimant is only contesting one-half of the garment. Since they split the disputed portion, they take half of that disputed half, which equals one-quarter (1/4).",
        commentaryHe: "\u05D4\u05E6\u05D3 \u05D4\u05E9\u05E0\u05D9 \u05DE\u05D5\u05D3\u05D4 \u05E9\u05D4\u05D7\u05E6\u05D9 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF \u05E9\u05D9\u05D9\u05DA \u05DC\u05D9\u05E8\u05D9\u05D1\u05D5, \u05D5\u05DC\u05DB\u05DF \u05D4\u05D5\u05D0 \u05D6\u05DB\u05D0\u05D9 \u05DC\u05EA\u05D1\u05D5\u05E2 \u05E8\u05E7 \u05D0\u05EA \u05D7\u05E6\u05D9 \u05D4\u05D5\u05D5\u05D9\u05DB\u05D5\u05D7, \u05E7\u05E8\u05D9 \u05E8\u05D1\u05E2 (1/4) \u05DE\u05D4\u05D8\u05DC\u05D9\u05EA \u05DB\u05D5\u05DC\u05D4.",
        talmudicType: "\u05EA\u05D9\u05E8\u05D5\u05E5"
      }
    ],
    overallExplanationEn: "This highly-celebrated Mishna opens Tractate Bava Metzia, establishing fundamental principles of civil jurisprudence in property claims and physical possession. When two parties are in simultaneous physical possession of helper disputed object and make fully conflicting claims, the court splits ownership equally ('Yachloku') to reflect their equal physical holding. However, because each might be lying, helper Rabbinic oath is mandated to deter perjury. This sets the stage for the profound legal principle: 'Tafis' (physical grasp) serves as tentative proof of partial ownership until disproven.",
    overallExplanationHe: "\u05DE\u05E9\u05E0\u05D4 \u05DE\u05E4\u05D5\u05E8\u05E1\u05DE\u05EA \u05D6\u05D5 \u05E4\u05D5\u05EA\u05D7\u05EA \u05D0\u05EA \u05DE\u05E1\u05DB\u05EA \u05D1\u05D1\u05D0 \u05DE\u05E6\u05D9\u05E2\u05D0 \u05D5\u05DE\u05DB\u05D5\u05E0\u05E0\u05EA \u05D0\u05EA \u05D9\u05E1\u05D5\u05D3\u05D5\u05EA \u05D4\u05DE\u05E9\u05E4\u05D8 \u05D4\u05D0\u05D6\u05E8\u05D7\u05D9 \u05D1\u05D3\u05D9\u05E0\u05D9 \u05DE\u05DE\u05D5\u05E0\u05D5\u05EA \u05D5\u05D3\u05D9\u05E0\u05D9 \u05DE\u05D5\u05D7\u05D6\u05E7\u05D5\u05EA. \u05DB\u05D0\u05E9\u05E8 \u05E9\u05E0\u05D9 \u05E6\u05D3\u05D3\u05D9\u05DD \u05DE\u05D7\u05D6\u05D9\u05E7\u05D9\u05DD \u05E4\u05D9\u05D6\u05D9\u05EA \u05D1\u05D7\u05E4\u05E5 \u05D0\u05D7\u05D3 \u05D5\u05DE\u05E2\u05DC\u05D9\u05DD \u05D8\u05E2\u05E0\u05D5\u05EA \u05E1\u05D5\u05EA\u05E8\u05D5\u05EA, \u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF \u05E4\u05D5\u05E1\u05E7 \u05DC\u05D7\u05DC\u05D5\u05E7\u05D4 \u05E9\u05D5\u05D5\u05D9\u05D5\u05E0\u05D9\u05EA \u05DB\u05D3\u05D9 \u05DC\u05E9\u05E7\u05E3 \u05D0\u05EA \u05D4\u05D7\u05D6\u05E7\u05D4 \u05D4\u05E4\u05D9\u05D6\u05D9\u05EA \u05D4\u05E9\u05D5\u05D5\u05D4 \u05E9\u05DC\u05D4\u05DD. \u05D7\u05DB\u05DE\u05D9\u05DD \u05DE\u05D8\u05D9\u05DC\u05D9\u05DD \u05E9\u05D1\u05D5\u05E2\u05EA \u05D1\u05D9\u05EA \u05D3\u05D9\u05DF \u05DB\u05D3\u05D9 \u05DC\u05DE\u05E0\u05D5\u05E2 \u05DE\u05E8\u05DE\u05D0\u05D5\u05EA \u05D5\u05E0\u05D9\u05E6\u05D5\u05DC \u05D4\u05D7\u05D5\u05E7. \u05DE\u05DB\u05D0\u05DF \u05E0\u05DC\u05DE\u05D3 \u05D4\u05E2\u05D9\u05E7\u05E8\u05D5\u05DF \u05D4\u05DE\u05E9\u05E4\u05D8\u05D9 \u05D4\u05E2\u05DC\u05D9\u05D5\u05DF \u05DC\u05E4\u05D9\u05D5 \u05D7\u05D6\u05E7\u05D4 \u05E4\u05D9\u05D6\u05D9\u05EA ('\u05EA\u05E4\u05D9\u05E1\u05D4') \u05DE\u05D4\u05D5\u05D5\u05D4 \u05E8\u05D0\u05D9\u05D4 \u05DC\u05DB\u05D0\u05D5\u05E8\u05D4 \u05DC\u05D6\u05DB\u05D5\u05EA \u05E7\u05E0\u05D9\u05D9\u05E0\u05D9\u05EA \u05E2\u05D3 \u05E9\u05D9\u05D5\u05DB\u05D7 \u05D0\u05D7\u05E8\u05EA.",
    legalPrinciples: [
      {
        conceptEn: "Physical Possession as Legal Hold (\u05EA\u05E4\u05D9\u05E1\u05D4)",
        conceptHe: "\u05DB\u05DC \u05D3\u05D0\u05DC\u05D9\u05DD \u05D2\u05D1\u05E8 \u05D0\u05D5 \u05E9\u05E0\u05D9\u05D9\u05DD \u05DE\u05D5\u05D7\u05D6\u05E7\u05D9\u05DD",
        applicationEn: "Grasping helper physical object suggests ownership, forcing the court to start with on-site equal allocation.",
        applicationHe: "\u05D0\u05D7\u05D9\u05D6\u05D4 \u05E4\u05D9\u05D6\u05D9\u05EA \u05D1\u05D7\u05E4\u05E5 \u05DE\u05E7\u05D9\u05DE\u05D4 \u05D7\u05D6\u05E7\u05D4 \u05DE\u05E9\u05E4\u05D8\u05D9\u05EA \u05DC\u05E4\u05D9\u05D4 \u05D4\u05D7\u05E4\u05E5 \u05E9\u05D9\u05D9\u05DA \u05DC\u05DE\u05D9 \u05E9\u05D0\u05D5\u05D7\u05D6 \u05D1\u05D5, \u05D3\u05D1\u05E8 \u05D4\u05DE\u05D0\u05DC\u05E5 \u05D0\u05EA \u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF \u05DC\u05E4\u05E1\u05D5\u05E7 \u05D7\u05DC\u05D5\u05E7\u05D4 \u05E9\u05D5\u05D5\u05D4."
      },
      {
        conceptEn: "Compromise Oath (\u05E9\u05D1\u05D5\u05E2\u05EA \u05D4\u05DE\u05E9\u05E0\u05D4)",
        conceptHe: "\u05E9\u05D1\u05D5\u05E2\u05EA \u05E9\u05D0\u05D9\u05E0\u05D5 \u05D1\u05E8\u05E9\u05D5\u05EA\u05D5 / \u05E9\u05DE\u05D0 \u05E8\u05DE\u05D0\u05D9",
        applicationEn: "To discourage fraudulent claims from obtaining property without divine self-verification, they swear to their half before dividing.",
        applicationHe: "\u05DB\u05D3\u05D9 \u05DC\u05DE\u05E0\u05D5\u05E2 \u05DE\u05D0\u05D3\u05DD \u05E7\u05E0\u05D8\u05E8\u05DF \u05DC\u05D6\u05DB\u05D5\u05EA \u05D1\u05E0\u05DB\u05E1\u05D9\u05DD \u05E7\u05E0\u05D9\u05D9\u05E0\u05D9\u05D9\u05DD \u05E9\u05D0\u05D9\u05E0\u05DD \u05E9\u05DC\u05D5 \u05D1\u05DE\u05E6\u05D9\u05D0\u05D4, \u05DE\u05D7\u05D9\u05D9\u05D1\u05D9\u05DD \u05D0\u05D5\u05EA\u05D5 \u05DC\u05D4\u05D9\u05E9\u05D1\u05E2 \u05D1\u05D0\u05DE\u05D5\u05E0\u05EA\u05D5 \u05E9\u05D0\u05D9\u05E0\u05D5 \u05E4\u05D7\u05D5\u05EA \u05DE\u05D7\u05E6\u05D9\u05D4."
      }
    ]
  },
  "oven-of-akhnai": {
    title: "The Oven of Akhnai / \u05EA\u05E0\u05D5\u05E8\u05D5 \u05E9\u05DC \u05E2\u05DB\u05E0\u05D0\u05D9",
    tractate: "Bava Metzia 59b",
    category: "Aggadah / Gemara (\u05D0\u05D2\u05D3\u05D4 \u05D5\u05D2\u05DE\u05E8\u05D0)",
    sages: [
      {
        nameEn: "Rabbi Eliezer ben Hurcanus",
        nameHe: "\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05D1\u05DF \u05D4\u05D5\u05E8\u05E7\u05E0\u05D5\u05E1",
        role: "Tanna",
        descriptionEn: "A giant of the early Mishnaic era known for his encyclopedic memory and conservative approach. He believed in absolute, objective halakhic truths.",
        descriptionHe: "\u05E2\u05E0\u05E7 \u05DE\u05EA\u05E7\u05D5\u05E4\u05EA \u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05D4\u05DE\u05D5\u05E7\u05D3\u05DE\u05EA, \u05E0\u05D5\u05D3\u05E2 \u05D1\u05DB\u05D9\u05E0\u05D5\u05D9\u05D5 '\u05D1\u05D5\u05E8 \u05E1\u05D5\u05D3 \u05E9\u05D0\u05D9\u05E0\u05D5 \u05DE\u05D0\u05D1\u05D3 \u05D8\u05D9\u05E4\u05D4'. \u05E1\u05D1\u05E8 \u05E9\u05D4\u05D4\u05DC\u05DB\u05D4 \u05E0\u05E7\u05D1\u05E2\u05EA \u05DC\u05E4\u05D9 \u05D0\u05DE\u05EA \u05D0\u05DC\u05D5\u05D4\u05D9\u05EA \u05DE\u05D5\u05D7\u05DC\u05D8\u05EA."
      },
      {
        nameEn: "Rabbi Joshua ben Hananiah",
        nameHe: "\u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05D1\u05DF \u05D7\u05E0\u05E0\u05D9\u05D4",
        role: "Tanna",
        descriptionEn: "A leading sage who championed human intellect, majority decision-making, and the application of reason over supernatural signs.",
        descriptionHe: "\u05DE\u05E8\u05D0\u05E9\u05D9 \u05D4\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF \u05D5\u05D7\u05D1\u05E8\u05D9 \u05D4\u05DC\u05E9\u05DB\u05D4, \u05D4\u05D5\u05D1\u05D9\u05DC \u05D0\u05EA \u05D4\u05D2\u05D9\u05E9\u05D4 \u05E9\u05E2\u05DC \u05E4\u05D9\u05D4 \u05E7\u05D1\u05D9\u05E2\u05EA \u05D4\u05D4\u05DC\u05DB\u05D4 \u05D5\u05D4\u05EA\u05D5\u05E8\u05D4 \u05DE\u05E1\u05D5\u05E8\u05D4 \u05DC\u05E9\u05DB\u05DC \u05D4\u05D0\u05E0\u05D5\u05E9\u05D9 \u05D5\u05DC\u05E8\u05D5\u05D1 \u05E9\u05DC \u05D7\u05D1\u05E8\u05D9 \u05D4\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF."
      }
    ],
    keywords: [
      {
        term: "\u05D9\u05D5\u05DB\u05D9\u05D7",
        meaningEn: "Will prove it!",
        meaningHe: "\u05D9\u05D5\u05DB\u05D9\u05D7 \u05D6\u05D0\u05EA!",
        functionEn: "Invokes helper physical, supernatural miracle as helper proof for helper legal opinion",
        functionHe: "\u05D1\u05D9\u05D8\u05D5\u05D9 \u05D4\u05DE\u05E9\u05DE\u05E9 \u05DC\u05E7\u05E8\u05D9\u05D0\u05D4 \u05DC\u05DE\u05D5\u05E4\u05EA \u05D8\u05D1\u05E2\u05D9 \u05D0\u05D5 \u05E0\u05E1 \u05E9\u05D9\u05D5\u05DB\u05D9\u05D7 \u05D1\u05E6\u05D5\u05E8\u05D4 \u05E2\u05DC-\u05D8\u05D1\u05E2\u05D9\u05EA \u05D0\u05EA \u05D3\u05E2\u05EA\u05D5 \u05D4\u05D4\u05DC\u05DB\u05EA\u05D9\u05EA"
      },
      {
        term: "\u05D0\u05D9\u05DF \u05DE\u05D1\u05D9\u05D0\u05D9\u05DF \u05E8\u05D0\u05D9\u05D4",
        meaningEn: "We do not bring proof from...",
        meaningHe: "\u05D0\u05D9\u05DF \u05DE\u05D1\u05D9\u05D0\u05D9\u05DD \u05E8\u05D0\u05D9\u05D4 \u05DE...",
        functionEn: "Rejects cosmological signs as valid legal precedents or arguments",
        functionHe: "\u05D3\u05D7\u05D9\u05D9\u05EA \u05E1\u05DE\u05DB\u05D5\u05EA\u05DD \u05E9\u05DC \u05E0\u05E1\u05D9\u05DD \u05D5\u05E1\u05D9\u05DE\u05E0\u05D9\u05DD \u05E4\u05D9\u05D6\u05D9\u05D9\u05DD \u05D1\u05E7\u05D1\u05D9\u05E2\u05EA \u05D7\u05D5\u05E7\u05D9\u05DD \u05DE\u05E9\u05E4\u05D8\u05D9\u05D9\u05DD \u05D5\u05D3\u05D9\u05D5\u05E0\u05D9\u05DD"
      },
      {
        term: "\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0",
        meaningEn: "It is not in Heaven",
        meaningHe: "\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0",
        functionEn: "Establishes human consensus and Majority Rule as the supreme authority in earthly law",
        functionHe: "\u05DB\u05DC\u05DC \u05D9\u05E1\u05D5\u05D3 \u05D4\u05DE\u05DB\u05D5\u05E0\u05DF \u05D0\u05EA \u05E9\u05DC\u05D8\u05D5\u05DF \u05D4\u05D7\u05D5\u05E7, \u05D4\u05E8\u05D5\u05D1 \u05D5\u05D4\u05E9\u05DB\u05DC\u05EA \u05D7\u05DB\u05DE\u05D9\u05DD \u05D1\u05E2\u05D5\u05DC\u05DD \u05D4\u05D6\u05D4 \u05DE\u05D7\u05D5\u05E5 \u05DC\u05E4\u05D9\u05E7\u05D5\u05D7 \u05E9\u05DE\u05D9\u05D9\u05DE\u05D9"
      }
    ],
    discussionFlow: [
      {
        stepNumber: 1,
        stageEn: "Halakhic Disagree (\u05DE\u05D9\u05DE\u05E8\u05D0)",
        stageHe: "\u05E4\u05D9\u05E8\u05D5\u05D8 \u05D4\u05DE\u05D7\u05DC\u05D5\u05E7\u05EA",
        detailsEn: "Rabbi Eliezer presents exhaustive arguments to declare the segmented tile oven pure, but the assembly of Sages rejects his opinion.",
        detailsHe: "\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05DE\u05E0\u05E1\u05D4 \u05DC\u05D4\u05DB\u05E9\u05D9\u05E8 \u05D0\u05EA \u05D4\u05EA\u05E0\u05D5\u05E8 \u05D4\u05D7\u05EA\u05D5\u05DA \u05D1\u05D7\u05D5\u05DC \u05D5\u05E8\u05E4\u05E9, \u05D5\u05DE\u05D1\u05D9\u05D0 \u05DB\u05DC \u05E8\u05D0\u05D9\u05D4 \u05D4\u05DC\u05DB\u05EA\u05D9\u05EA \u05E9\u05D1\u05E2\u05D5\u05DC\u05DD \u05D1\u05E4\u05E0\u05D9 \u05D7\u05D1\u05E8\u05D9 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05DB\u05D3\u05D9 \u05DC\u05D8\u05D4\u05E8\u05D5, \u05D0\u05DA \u05D4\u05DD \u05DE\u05DE\u05D0\u05E0\u05D9\u05DD \u05DC\u05E7\u05D1\u05DC\u05DF."
      },
      {
        stepNumber: 2,
        stageEn: "Cosmic Testimonials (\u05E8\u05D0\u05D9\u05D4)",
        stageHe: "\u05D4\u05D1\u05D0\u05EA \u05E8\u05D0\u05D9\u05D4 \u05E7\u05D5\u05E1\u05DE\u05D9\u05EA (\u05E0\u05E1)",
        detailsEn: "Rabbi Eliezer invokes a series of supernatural signs: helper uprooted carob tree, backward flowing stream, and tilting walls to confirm his view.",
        detailsHe: "\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05E7\u05D5\u05E8\u05D0 \u05DC\u05E9\u05E8\u05E9\u05E8\u05EA \u05E0\u05E1\u05D9\u05DD \u05DE\u05D5\u05E4\u05DC\u05D0\u05D9\u05DD: \u05E2\u05E7\u05D9\u05E8\u05EA \u05E2\u05E5 \u05D7\u05E8\u05D5\u05D1, \u05D4\u05E4\u05D9\u05DB\u05EA \u05DB\u05D9\u05D5\u05D5\u05DF \u05D6\u05E8\u05D9\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD \u05E9\u05DC \u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD, \u05D5\u05D4\u05D8\u05D9\u05D9\u05EA \u05E7\u05D9\u05E8\u05D5\u05EA \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05DB\u05D3\u05D9 \u05DC\u05D0\u05DE\u05EA \u05D0\u05EA \u05D3\u05E2\u05EA\u05D5."
      },
      {
        stepNumber: 3,
        stageEn: "Rational Objection (\u05E7\u05D5\u05E9\u05D9\u05D0)",
        stageHe: "\u05D3\u05D7\u05D9\u05D9\u05EA \u05D4\u05E8\u05D0\u05D9\u05D4 \u05D4\u05DE\u05D5\u05E4\u05DC\u05D0\u05D4",
        detailsEn: "The Sages reject each cosmos disruption sequentially, asserting that natural events do not count as legal evidence in a court of law.",
        detailsHe: "\u05D4\u05D7\u05DB\u05DE\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D9\u05DD \u05D1\u05E8\u05D0\u05E9\u05D5\u05EA \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05D3\u05D5\u05D7\u05D9\u05DD \u05D0\u05EA \u05D4\u05E0\u05E1\u05D9\u05DD, \u05D1\u05D8\u05E2\u05E0\u05D4 \u05E9\u05E2\u05D5\u05DC\u05DD \u05D4\u05D7\u05D5\u05E7 \u05D5\u05D4\u05D4\u05DC\u05DB\u05D4 \u05DE\u05E0\u05D5\u05EA\u05E7 \u05DE\u05E9\u05D9\u05D1\u05D5\u05E9 \u05D4\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4 \u05D5\u05D0\u05D9\u05E0\u05D5 \u05D0\u05D5\u05DE\u05D3 \u05E0\u05E1\u05D9\u05DD."
      },
      {
        stepNumber: 4,
        stageEn: "Divine Bat Kol (\u05E8\u05D0\u05D9\u05D4)",
        stageHe: "\u05D4\u05EA\u05E2\u05E8\u05D1\u05D5\u05EA \u05E9\u05DE\u05D9\u05D9\u05DE\u05D9\u05EA",
        detailsEn: "A voice from heaven (Bat Kol) declares helper verdict directly, declaring that Rabbi Eliezer's legal rulings are universally correct.",
        detailsHe: "\u05D1\u05EA \u05E7\u05D5\u05DC \u05DE\u05E9\u05DE\u05D9\u05D9\u05DD \u05DE\u05EA\u05E2\u05E8\u05D1\u05EA \u05D5\u05DE\u05DB\u05E8\u05D9\u05D6\u05D4 \u05D1\u05D0\u05D5\u05E4\u05DF \u05D7\u05D3-\u05DE\u05E9\u05DE\u05E2\u05D9 \u05E9\u05D4\u05D4\u05DC\u05DB\u05D4 \u05E6\u05D5\u05D3\u05E7\u05EA \u05D1\u05DB\u05DC \u05DE\u05E7\u05D5\u05DD \u05DB\u05D3\u05E2\u05EA \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8."
      },
      {
        stepNumber: 5,
        stageEn: "Ultimate Ruling (\u05EA\u05D9\u05E8\u05D5\u05E5)",
        stageHe: "\u05D4\u05DB\u05E8\u05E2\u05D4 \u05D3\u05DE\u05D5\u05E7\u05E8\u05D8\u05D9\u05EA \u05D0\u05E0\u05D5\u05E9\u05D9\u05EA",
        detailsEn: "Rabbi Joshua rises up and explicitly shuts down the heavenly voice citing Deuteronomy: 'It is not in Heaven.' Heaven gave the Torah to men on Earth; law operates by human majority.",
        detailsHe: "\u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05E7\u05DD \u05D5\u05DE\u05E1\u05E8\u05D1 \u05DC\u05D4\u05D9\u05E9\u05DE\u05E2 \u05DC\u05E7\u05D5\u05DC \u05D4\u05D0\u05DC\u05D5\u05D4\u05D9 \u05D4\u05DE\u05D1\u05D8\u05DC \u05D0\u05EA \u05D4\u05E9\u05E7\u05DC\u05D0 \u05D5\u05D8\u05E8\u05D9\u05D0 \u05D4\u05D0\u05E0\u05D5\u05E9\u05D9, \u05D1\u05E6\u05D9\u05D9\u05E0\u05D5 \u05D0\u05EA \u05D4\u05E4\u05E1\u05D5\u05E7 '\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0' \u2013 \u05D4\u05EA\u05D5\u05E8\u05D4 \u05E0\u05DE\u05E1\u05E8\u05D4 \u05DE\u05E2\u05EA\u05D4 \u05DC\u05E8\u05D5\u05D1 \u05D4\u05E9\u05DB\u05DC\u05D9 \u05D4\u05D0\u05E0\u05D5\u05E9\u05D9."
      }
    ],
    lineByLine: [
      {
        original: "\u05EA\u05E0\u05D0: \u05D1\u05D0\u05D5\u05EA\u05D5 \u05D4\u05D9\u05D5\u05DD \u05D4\u05E9\u05D9\u05D1 \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05DB\u05DC \u05EA\u05E9\u05D5\u05D1\u05D5\u05EA \u05E9\u05D1\u05E2\u05D5\u05DC\u05DD \u05D5\u05DC\u05D0 \u05E7\u05D9\u05D1\u05DC\u05D5 \u05D4\u05D9\u05DE\u05E0\u05D5.",
        translationEn: "A Sage taught in a Baraita: On that historic day, Rabbi Eliezer replied with all the logical answers in the world, yet the Sages refused to accept his lenient view.",
        translationHe: "\u05E9\u05E0\u05D4 \u05D4\u05EA\u05E0\u05D0 \u05D1\u05D1\u05E8\u05D9\u05D9\u05EA\u05D0: \u05D1\u05D0\u05D5\u05EA\u05D5 \u05D9\u05D5\u05DD \u05E1\u05D5\u05E2\u05E8 \u05D4\u05E9\u05D9\u05D1 \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05D0\u05EA \u05DB\u05DC \u05D4\u05EA\u05E9\u05D5\u05D1\u05D5\u05EA \u05D5\u05D4\u05E0\u05D9\u05DE\u05D5\u05E7\u05D9\u05DD \u05E9\u05E7\u05D9\u05D9\u05DE\u05D9\u05DD \u05D1\u05E2\u05D5\u05DC\u05DD \u05DB\u05D3\u05D9 \u05DC\u05D8\u05D4\u05E8 \u05D0\u05EA \u05D4\u05EA\u05E0\u05D5\u05E8, \u05D0\u05DA \u05D7\u05DB\u05DE\u05D9\u05DD \u05DC\u05D0 \u05D4\u05E1\u05DB\u05D9\u05DE\u05D5 \u05E2\u05DE\u05D5.",
        commentaryEn: "This establishes helper profound, high-tension deadlock in the Beit Midrash: one hyper-genius standing against on-site democratic consensus.",
        commentaryHe: "\u05DE\u05E9\u05E4\u05D8 \u05D6\u05D4 \u05DE\u05DB\u05D5\u05E0\u05DF \u05D0\u05EA \u05D4\u05DE\u05D1\u05D5\u05D9 \u05D4\u05E1\u05EA\u05D5\u05DD \u05D4\u05D3\u05E8\u05DE\u05D8\u05D9 \u05D1\u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9: \u05D2\u05D0\u05D5\u05DF \u05D9\u05D7\u05D9\u05D3 \u05D4\u05E2\u05D5\u05DE\u05D3 \u05DE\u05D5\u05DC \u05E8\u05D5\u05D1 \u05D4\u05D7\u05DB\u05DE\u05D9\u05DD \u05D4\u05DE\u05D0\u05D5\u05D7\u05D3\u05D9\u05DD \u05D1\u05D3\u05E2\u05EA\u05DD.",
        talmudicType: "\u05DE\u05D9\u05DE\u05E8\u05D0"
      },
      {
        original: "\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D9 - \u05D7\u05E8\u05D5\u05D1 \u05D6\u05D4 \u05D9\u05D5\u05DB\u05D9\u05D7!' \u05E0\u05E2\u05E7\u05E8 \u05D7\u05E8\u05D5\u05D1 \u05DE\u05DE\u05E7\u05D5\u05DE\u05D5 \u05DE\u05D0\u05D4 \u05D0\u05DE\u05D4, \u05D5\u05D0\u05DE\u05E8\u05D9 \u05DC\u05D4 \u05D0\u05E8\u05D1\u05E2 \u05DE\u05D0\u05D5\u05EA \u05D0\u05DE\u05D4.",
        translationEn: "Rabbi Eliezer said to them: 'If the law is like my opinion, let this carob tree prove its truth!' Instantly, the carob tree was uprooted from its soil for 100 cubits (and some say 400 cubits).",
        translationHe: "\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8: '\u05D0\u05DD \u05D4\u05D4\u05DC\u05DB\u05D4 \u05D5\u05D4\u05D0\u05DE\u05EA \u05DB\u05D3\u05E2\u05EA\u05D9 \u2013 \u05E2\u05E5 \u05D7\u05E8\u05D5\u05D1 \u05D6\u05D4 \u05D9\u05D5\u05DB\u05D9\u05D7 \u05D6\u05D0\u05EA!' \u05DE\u05D9\u05D3 \u05E0\u05E2\u05E7\u05E8 \u05E2\u05E5 \u05D4\u05D7\u05E8\u05D5\u05D1 \u05DE\u05DE\u05E7\u05D5\u05DE\u05D5 \u05D5\u05E2\u05E3 \u05DC\u05DE\u05E8\u05D7\u05E7 \u05E9\u05DC \u05DE\u05D0\u05D4 \u05D0\u05DE\u05D5\u05EA (\u05D5\u05D9\u05E9 \u05E9\u05D0\u05D5\u05DE\u05E8\u05D9\u05DD \u05D0\u05E8\u05D1\u05E2 \u05DE\u05D0\u05D5\u05EA \u05D0\u05DE\u05D5\u05EA).",
        commentaryEn: "Having failed to persuade them with hermeneutics, Rabbi Eliezer pivots to supernatural cosmos alterations, hoping divine control proves legal truth.",
        commentaryHe: "\u05DC\u05D0\u05D7\u05E8 \u05E9\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D9\u05D7 \u05DC\u05E9\u05DB\u05E0\u05E2\u05DD \u05D1\u05E1\u05D1\u05E8\u05D5\u05EA \u05E9\u05DB\u05DC\u05D9\u05D5\u05EA, \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05E4\u05D5\u05E0\u05D4 \u05DC\u05E9\u05D9\u05E0\u05D5\u05D9 \u05E1\u05D3\u05E8\u05D9 \u05D1\u05E8\u05D0\u05E9\u05D9\u05EA, \u05D1\u05D4\u05E0\u05D7\u05D4 \u05E9\u05D4\u05EA\u05E2\u05E8\u05D1\u05D5\u05EA \u05D0\u05DC\u05D5\u05D4\u05D9\u05EA \u05D1\u05D8\u05D1\u05E2 \u05DE\u05DB\u05E8\u05D9\u05E2\u05D4 \u05D0\u05EA \u05D4\u05D3\u05D9\u05DF.",
        talmudicType: "\u05E8\u05D0\u05D9\u05D4"
      },
      {
        original: "\u05D0\u05DE\u05E8\u05D5 \u05DC\u05D5: '\u05D0\u05D9\u05DF \u05DE\u05D1\u05D9\u05D0\u05D9\u05DF \u05E8\u05D0\u05D9\u05D4 \u05DE\u05DF \u05D4\u05D7\u05E8\u05D5\u05D1'.",
        translationEn: "The Sages replied to him: 'We do not bring halakhic proof from and cannot decide law based on a carob tree!'",
        translationHe: "\u05D0\u05DE\u05E8\u05D5 \u05DC\u05D5 \u05D7\u05D1\u05E8\u05D9 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9: '\u05D0\u05D9\u05DF \u05DE\u05D1\u05D9\u05D0\u05D9\u05DD \u05E8\u05D0\u05D9\u05D4 \u05D0\u05D5 \u05E4\u05E1\u05E7 \u05D4\u05DC\u05DB\u05D4 \u05DE\u05EA\u05D5\u05DA \u05D4\u05EA\u05E0\u05D4\u05D2\u05D5\u05EA \u05E2\u05E5 \u05D7\u05E8\u05D5\u05D1'.",
        commentaryEn: "The Sages separate physical phenomena and miracles from legal reasoning. A miracle is spectacular, but it carries zero weight in rabbinic debate.",
        commentaryHe: "\u05D7\u05DB\u05DE\u05D9\u05DD \u05DE\u05E4\u05E8\u05D9\u05D3\u05D9\u05DD \u05D1\u05E6\u05D5\u05E8\u05D4 \u05D7\u05D3\u05D4 \u05D1\u05D9\u05DF \u05D4\u05DE\u05E9\u05E4\u05D8 \u05DC\u05D1\u05D9\u05DF \u05D4\u05DE\u05D8\u05D0\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4. \u05DE\u05D5\u05E4\u05EA \u05E4\u05D9\u05D6\u05D9 \u05D4\u05D5\u05D0 \u05D0\u05D5\u05DC\u05D9 \u05DE\u05E8\u05E9\u05D9\u05DD, \u05D0\u05DA \u05D0\u05D9\u05E0\u05D5 \u05DE\u05D4\u05D5\u05D5\u05D4 \u05D8\u05D9\u05E2\u05D5\u05DF \u05DE\u05E9\u05E4\u05D8\u05D9 \u05E7\u05D1\u05D9\u05DC \u05D1\u05E1\u05E4\u05E8 \u05D4\u05D7\u05D5\u05E7\u05D9\u05DD.",
        talmudicType: "\u05E7\u05D5\u05E9\u05D9\u05D0"
      },
      {
        original: "\u05D7\u05D6\u05E8 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D9 - \u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD \u05D9\u05D5\u05DB\u05D9\u05D7\u05D5!' \u05D7\u05D6\u05E8\u05D5 \u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD \u05DC\u05D0\u05D7\u05D5\u05E8\u05D9\u05D4\u05DD.",
        translationEn: "He went back and argued to them: 'If the law is like my opinion, let this reverse water stream prove it!' The stream of water immediately flowed backwards.",
        translationHe: "\u05D7\u05D6\u05E8 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05D4\u05DC\u05DB\u05D4 \u05DB\u05D5\u05D5\u05EA\u05D9 \u2013 \u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD (\u05EA\u05E2\u05DC\u05EA \u05D4\u05DE\u05D9\u05DD) \u05EA\u05D5\u05DB\u05D9\u05D7 \u05D6\u05D0\u05EA!' \u05D5\u05DE\u05D9\u05D3 \u05D7\u05D6\u05E8\u05D5 \u05DE\u05D9 \u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD \u05DC\u05D6\u05E8\u05D5\u05DD \u05DC\u05D0\u05D7\u05D5\u05E8 \u05D1\u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05E4\u05D5\u05DA.",
        commentaryEn: "The second cosmic disruption is helper fluid shift. Water represents dynamic flow, yet the Sages remain unmoved and static in their legal mandate.",
        commentaryHe: "\u05D4\u05E0\u05E1 \u05D4\u05E9\u05E0\u05D9 \u05DE\u05E2\u05E8\u05D1 \u05D0\u05EA \u05D4\u05DE\u05D9\u05DD. \u05D4\u05DE\u05D9\u05DD \u05DE\u05D9\u05D9\u05E6\u05D2\u05D9\u05DD \u05D6\u05E8\u05D9\u05DE\u05D4 \u05D5\u05EA\u05E0\u05D5\u05E2\u05D4 \u05E7\u05D5\u05D8\u05D1\u05D9\u05EA, \u05D0\u05DA \u05D7\u05DB\u05DE\u05D9\u05DD \u05E0\u05D5\u05EA\u05E8\u05D9\u05DD \u05D9\u05E6\u05D9\u05D1\u05D9\u05DD \u05D5\u05D0\u05D9\u05E0\u05DD \u05E0\u05DB\u05E0\u05E2\u05D9\u05DD \u05DC\u05E0\u05E1.",
        talmudicType: "\u05E8\u05D0\u05D9\u05D4"
      },
      {
        original: "\u05D0\u05DE\u05E8\u05D5 \u05DC\u05D5: '\u05D0\u05D9\u05DF \u05DE\u05D1\u05D9\u05D0\u05D9\u05DF \u05E8\u05D0\u05D9\u05D4 \u05DE\u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD'.",
        translationEn: "They retorted: 'One does not bring valid legal evidence from an active water stream!'",
        translationHe: "\u05D0\u05DE\u05E8\u05D5 \u05DC\u05D5: '\u05D0\u05D9\u05DF \u05DE\u05D1\u05D9\u05D0\u05D9\u05DD \u05E8\u05D0\u05D9\u05D4 \u05D4\u05DC\u05DB\u05EA\u05D9\u05EA \u05DE\u05D6\u05E8\u05D9\u05DE\u05EA \u05DE\u05D9\u05DD \u05D1\u05D0\u05DE\u05EA \u05D4\u05DE\u05D9\u05DD'.",
        commentaryEn: "Again, they enforce the border of the judicial system. Physical laws may bend, but human jurisprudential code does not.",
        commentaryHe: "\u05E9\u05D5\u05D1, \u05D4\u05DD \u05DE\u05E9\u05DE\u05E8\u05D9\u05DD \u05D0\u05EA \u05D2\u05D1\u05D5\u05DC\u05D5\u05EA \u05D4\u05DE\u05E2\u05E8\u05DB\u05EA \u05D4\u05E9\u05D9\u05E4\u05D5\u05D8\u05D9\u05EA. \u05D7\u05D5\u05E7\u05D9 \u05D4\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4 \u05D9\u05DB\u05D5\u05DC\u05D9\u05DD \u05DC\u05D4\u05EA\u05D2\u05DE\u05E9, \u05D0\u05DA \u05D7\u05D5\u05E7\u05D9 \u05D4\u05D3\u05D9\u05D5\u05DF \u05D5\u05D4\u05D4\u05DB\u05E8\u05E2\u05D4 \u05D4\u05EA\u05D5\u05E8\u05E0\u05D9\u05D9\u05DD \u05E0\u05D5\u05EA\u05E8\u05D9\u05DD \u05D9\u05E6\u05D9\u05D1\u05D9\u05DD.",
        talmudicType: "\u05E7\u05D5\u05E9\u05D9\u05D0"
      },
      {
        original: "\u05D7\u05D6\u05E8 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D9 - \u05DB\u05D5\u05EA\u05DC\u05D9 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05D9\u05D5\u05DB\u05D9\u05D7\u05D5!' \u05D4\u05D8\u05D5 \u05DB\u05D5\u05EA\u05DC\u05D9 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05DC\u05D9\u05E4\u05D5\u05DC.",
        translationEn: "He went back and declared: 'If the law is like my opinion, let the very walls of this house of study prove it!' The walls of the Beit Midrash tilted and were ready to collapse.",
        translationHe: "\u05D7\u05D6\u05E8 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D9 \u2013 \u05E7\u05D9\u05E8\u05D5\u05EA \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05D4\u05DC\u05DC\u05D5 \u05D9\u05D5\u05DB\u05D9\u05D7\u05D5 \u05D6\u05D0\u05EA!' \u05DE\u05D9\u05D3 \u05D4\u05D7\u05DC\u05D5 \u05E7\u05D9\u05E8\u05D5\u05EA \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05DC\u05E0\u05D8\u05D5\u05EA \u05E2\u05DC \u05E6\u05D3\u05DD \u05D5\u05DC\u05E2\u05DE\u05D5\u05D3 \u05D1\u05E4\u05E0\u05D9 \u05E7\u05E8\u05D9\u05E1\u05D4.",
        commentaryEn: "The conflict moves threat-close, directly impacting the brick and mortar structure of the institution of rabbinic debate.",
        commentaryHe: "\u05D4\u05E2\u05D9\u05DE\u05D5\u05EA \u05DE\u05EA\u05E7\u05E8\u05D1 \u05E4\u05D9\u05D6\u05D9\u05EA \u05D5\u05DE\u05D0\u05D9\u05D9\u05DD \u05D9\u05E9\u05D9\u05E8\u05D5\u05EA \u05E2\u05DC \u05E7\u05D9\u05E8\u05D5\u05EA \u05D4\u05DE\u05D5\u05E1\u05D3 \u05E9\u05DE\u05DB\u05D9\u05DC \u05D5\u05DE\u05D0\u05E4\u05E9\u05E8 \u05D0\u05EA \u05D4\u05D3\u05D9\u05D5\u05DF \u05D4\u05D4\u05DC\u05DB\u05EA\u05D9 \u2013 \u05D1\u05D9\u05EA \u05D4\u05DE\u05D3\u05E8\u05E9 \u05E2\u05E6\u05DE\u05D5.",
        talmudicType: "\u05E8\u05D0\u05D9\u05D4"
      },
      {
        original: "\u05D2\u05E2\u05E8 \u05D1\u05D4\u05DD \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2, \u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05EA\u05DC\u05DE\u05D9\u05D3\u05D9 \u05D7\u05DB\u05DE\u05D9\u05DD \u05DE\u05E0\u05E6\u05D7\u05D9\u05DD \u05D6\u05D4 \u05D0\u05EA \u05D6\u05D4 \u05D1\u05D4\u05DC\u05DB\u05D4, \u05D0\u05EA\u05DD \u05DE\u05D4 \u05D8\u05D9\u05D1\u05DB\u05DD?'",
        translationEn: "Rabbi Joshua rebuked the stone walls, saying: 'If Torah scholars are engaging with one another in halakhic debate, by what right do you interfere?!'",
        translationHe: "\u05D2\u05E2\u05E8 \u05D1\u05E7\u05D9\u05E8\u05D5\u05EA \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05EA\u05DC\u05DE\u05D9\u05D3\u05D9 \u05D7\u05DB\u05DE\u05D9\u05DD \u05DE\u05EA\u05D5\u05D5\u05DB\u05D7\u05D9\u05DD \u05D5\u05DE\u05E0\u05E6\u05D7\u05D9\u05DD \u05D6\u05D4 \u05D0\u05EA \u05D6\u05D4 \u05D1\u05D4\u05DC\u05DB\u05D4, \u05E7\u05D9\u05E8\u05D5\u05EA \u05D0\u05D1\u05DF, \u05DE\u05D4 \u05E2\u05E0\u05D9\u05D9\u05E0\u05DB\u05DD \u05DC\u05D4\u05EA\u05E2\u05E8\u05D1?'",
        commentaryEn: "Rabbi Joshua forcefully claims academic independence. Nature and structures are subordinate to the minds arguing human policy inside.",
        commentaryHe: "\u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05EA\u05D5\u05D1\u05E2 \u05D0\u05EA \u05E2\u05E6\u05DE\u05D0\u05D5\u05EA \u05D4\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4 \u05D5\u05DE\u05D5\u05DB\u05D9\u05D7 \u05D0\u05EA \u05E7\u05D9\u05E8\u05D5\u05EA \u05D4\u05DE\u05D1\u05E0\u05D4. \u05D4\u05D8\u05D1\u05E2 \u05D5\u05D4\u05DE\u05D1\u05E0\u05D9\u05DD \u05DB\u05E4\u05D5\u05E4\u05D9\u05DD \u05DC\u05D7\u05D5\u05E7 \u05D4\u05DE\u05D7\u05E9\u05D1\u05D4 \u05D5\u05DC\u05D0 \u05DC\u05D4\u05E4\u05DA.",
        talmudicType: "\u05E9\u05D0\u05DC\u05D4"
      },
      {
        original: "\u05DC\u05D0 \u05E0\u05E4\u05DC\u05D5 \u05DE\u05E4\u05E0\u05D9 \u05DB\u05D1\u05D5\u05D3\u05D5 \u05E9\u05DC \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2, \u05D5\u05DC\u05D0 \u05D6\u05E7\u05E4\u05D5 \u05DE\u05E4\u05E0\u05D9 \u05DB\u05D1\u05D5\u05D3\u05D5 \u05E9\u05DC \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8, \u05D5\u05E2\u05D3\u05D9\u05DF \u05DE\u05D8\u05D9\u05DF \u05D5\u05E2\u05D5\u05DE\u05D3\u05D9\u05DF.",
        translationEn: "They did not fall out of honor for Rabbi Joshua, nor did they stand straight again out of honor for Rabbi Eliezer; instead, they remain slanted to this very day.",
        translationHe: "\u05D4\u05E7\u05D9\u05E8\u05D5\u05EA \u05DC\u05D0 \u05E0\u05E4\u05DC\u05D5 \u05DE\u05D7\u05DE\u05EA \u05DB\u05D1\u05D5\u05D3\u05D5 \u05D4\u05E1\u05DE\u05DB\u05D5\u05EA\u05D9 \u05E9\u05DC \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2, \u05D0\u05DA \u05D2\u05DD \u05DC\u05D0 \u05D4\u05D6\u05D3\u05E7\u05E4\u05D5 \u05DE\u05EA\u05D5\u05DA \u05DB\u05D1\u05D5\u05D3\u05D5 \u05E9\u05DC \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8, \u05D5\u05E2\u05D3\u05D9\u05D9\u05DF \u05D4\u05DD \u05E2\u05D5\u05DE\u05D3\u05D9\u05DD \u05E0\u05D5\u05D8\u05D9\u05DD \u05E2\u05DC \u05E6\u05D3\u05DD \u05DB\u05DE\u05D6\u05DB\u05E8\u05EA.",
        commentaryEn: "A beautiful physical monument of absolute dynamic tension. Two immense intellectual forces permanently fossilized in helper tilting stone structure.",
        commentaryHe: "\u05D0\u05E0\u05D3\u05E8\u05D8\u05D4 \u05E4\u05D9\u05D6\u05D9\u05EA \u05E0\u05E4\u05DC\u05D0\u05D4 \u05DC\u05DE\u05E6\u05D1 \u05E9\u05DC \u05DE\u05EA\u05D7 \u05E8\u05D5\u05D7\u05E0\u05D9 \u05D5\u05D0\u05D9\u05E0\u05D8\u05DC\u05E7\u05D8\u05D5\u05D0\u05DC\u05D9 \u05DE\u05D5\u05D7\u05DC\u05D8. \u05E9\u05EA\u05D9 \u05D3\u05E2\u05D5\u05EA \u05E7\u05D5\u05D8\u05D1\u05D9\u05D5\u05EA \u05D5\u05E1\u05DE\u05DB\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05D5\u05E0\u05E6\u05D7\u05D5\u05EA \u05DC\u05E0\u05E6\u05D7 \u05D1\u05E7\u05D9\u05E8\u05D5\u05EA \u05D4\u05E0\u05D8\u05D5\u05D9\u05D9\u05DD.",
        talmudicType: "\u05DE\u05D9\u05DE\u05E8\u05D0"
      },
      {
        original: "\u05D7\u05D6\u05E8 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D9 - \u05DE\u05DF \u05D4\u05E9\u05DE\u05D9\u05DD \u05D9\u05D5\u05DB\u05D9\u05D7\u05D5!' \u05D9\u05E6\u05D0\u05D4 \u05D1\u05EA \u05E7\u05D5\u05DC \u05D5\u05D0\u05DE\u05E8\u05D4: '\u05DE\u05D4 \u05DC\u05DB\u05DD \u05D0\u05E6\u05DC \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05E9\u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D5 \u05D1\u05DB\u05DC \u05DE\u05E7\u05D5\u05DD!'",
        translationEn: "Rabbi Eliezer argued helper final time: 'If the law is like my opinion, let Heaven itself prove it!' Instantly, helper Heavenly Voice (Bat Kol) burst out saying: 'Who are you to challenge Rabbi Eliezer? The law is like his view in every single place!'",
        translationHe: "\u05D7\u05D6\u05E8 \u05D5\u05D0\u05DE\u05E8 \u05DC\u05D4\u05DD: '\u05D0\u05DD \u05D4\u05DC\u05DB\u05D4 \u05DB\u05D5\u05D5\u05EA\u05D9 \u2013 \u05DE\u05DF \u05D4\u05E9\u05DE\u05D9\u05DD \u05D9\u05D5\u05DB\u05D9\u05D7\u05D5!' \u05D9\u05E6\u05D0\u05D4 \u05D1\u05EA \u05E7\u05D5\u05DC \u05D0\u05DC\u05D5\u05D4\u05D9\u05EA \u05DE\u05D4\u05E8\u05E7\u05D9\u05E2 \u05D5\u05D0\u05DE\u05E8\u05D4: '\u05DE\u05D4 \u05DC\u05DB\u05DD \u05DC\u05D4\u05EA\u05D5\u05D5\u05DB\u05D7 \u05E2\u05DD \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8? \u05D4\u05E8\u05D9 \u05D4\u05DC\u05DB\u05D4 \u05DB\u05DE\u05D5\u05EA\u05D5 \u05D1\u05DB\u05DC \u05DE\u05E7\u05D5\u05DD \u05D5\u05DE\u05E7\u05D5\u05DD!'",
        commentaryEn: "The ultimate climax. The Author of the Law Himself intervenes, bypassing mortal methods to decide the legal matter with absolute authority.",
        commentaryHe: "\u05E9\u05D9\u05D0 \u05D4\u05D3\u05E8\u05DE\u05D4 \u05D1\u05E7\u05D8\u05E2. \u05E0\u05D5\u05EA\u05DF \u05D4\u05EA\u05D5\u05E8\u05D4 \u05D1\u05DB\u05D1\u05D5\u05D3\u05D5 \u05D5\u05D1\u05E2\u05E6\u05DE\u05D5 \u05DE\u05EA\u05E2\u05E8\u05D1 \u05D1\u05D3\u05D9\u05D5\u05DF \u05D4\u05D0\u05E0\u05D5\u05E9\u05D9, \u05D1\u05DE\u05D8\u05E8\u05D4 \u05DC\u05D4\u05D8\u05D5\u05EA \u05D0\u05EA \u05D4\u05DB\u05E3 \u05DC\u05D8\u05D5\u05D1\u05EA \u05D4\u05D7\u05DB\u05DD \u05D4\u05D9\u05D7\u05D9\u05D3.",
        talmudicType: "\u05E8\u05D0\u05D9\u05D4"
      },
      {
        original: "\u05E2\u05DE\u05D3 \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05E2\u05DC \u05E8\u05D2\u05DC\u05D9\u05D5 \u05D5\u05D0\u05DE\u05E8: '\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0!'",
        translationEn: "Rabbi Joshua stood firmly on his feet and announced: 'It is not in Heaven!' (Deuteronomy 30:12).",
        translationHe: "\u05E2\u05DE\u05D3 \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05E2\u05DC \u05E8\u05D2\u05DC\u05D9\u05D5 \u05D1\u05D2\u05D1\u05D5\u05E8\u05D4 \u05D5\u05D4\u05DB\u05E8\u05D9\u05D6: '\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0!' (\u05E1\u05E4\u05E8 \u05D3\u05D1\u05E8\u05D9\u05DD, \u05E4\u05E8\u05E7 \u05DC').",
        commentaryEn: "The core thesis of Rabbinic Judaism. By giving the Torah to humans on Earth, God relinquished exclusive legal interpretive power. The debate is now governed by earthly courts using majority rules.",
        commentaryHe: '\u05DE\u05E9\u05E4\u05D8 \u05D4\u05DE\u05D4\u05D5\u05D5\u05D4 \u05D0\u05EA \u05DC\u05D1-\u05DC\u05D1\u05D4 \u05E9\u05DC \u05D4\u05D9\u05D4\u05D3\u05D5\u05EA \u05D4\u05E8\u05D1\u05E0\u05D9\u05EA \u05D4\u05DC\u05DE\u05D3\u05E0\u05D9\u05EA. \u05D1\u05DE\u05EA\u05DF \u05D4\u05EA\u05D5\u05E8\u05D4 \u05DC\u05D1\u05E0\u05D9 \u05D0\u05D3\u05DD, \u05D4\u05E7\u05D1"\u05D4 \u05DE\u05E1\u05E8 \u05DC\u05D4\u05DD \u05D0\u05EA \u05E1\u05DE\u05DB\u05D5\u05EA \u05D4\u05E4\u05D9\u05E8\u05D5\u05E9 \u05D5\u05D7\u05E7\u05D9\u05E7\u05EA \u05D4\u05DE\u05E9\u05E0\u05D4 \u05D1\u05E7\u05E8\u05D1 \u05D4\u05DE\u05E9\u05E4\u05D8 \u05D4\u05D0\u05E0\u05D5\u05E9\u05D9.',
        talmudicType: "\u05EA\u05E9\u05D5\u05D1\u05D4"
      }
    ],
    overallExplanationEn: "This legendary Talmudic passage is helper foundational text regarding the nature of Rabbinic authority and legal democracy. It tells the story of the Oven of Akhnai, where Rabbi Eliezer stands isolated against the Sages on a legal question of cleanliness. He invokes miracles\u2014uprooting trees, reversing rivers, tilting walls, and helper voice from God. Yet, Rabbi Joshua asserts helper revolutionary legal principle: 'Lo BaShamayim Hi' (It is not in Heaven). Once the Torah was given at Sinai, divine guidance is no longer the arbiter of human law; rather, law is determined by the rational consensus of human scholars following majority rule.",
    overallExplanationHe: "\u05E1\u05D5\u05D2\u05D9\u05D4 \u05EA\u05DC\u05DE\u05D5\u05D3\u05D9\u05EA \u05DE\u05DB\u05D5\u05E0\u05E0\u05EA \u05D6\u05D5 \u05DE\u05D4\u05D5\u05D5\u05D4 \u05D0\u05EA \u05D0\u05D7\u05D3 \u05D4\u05D8\u05E7\u05E1\u05D8\u05D9\u05DD \u05D4\u05DE\u05E9\u05E4\u05D9\u05E2\u05D9\u05DD \u05D1\u05D9\u05D5\u05EA\u05E8 \u05E2\u05DC \u05D4\u05D1\u05E0\u05EA \u05D0\u05D5\u05E4\u05D9\u05D9\u05D4 \u05E9\u05DC \u05D4\u05E1\u05DE\u05DB\u05D5\u05EA \u05D4\u05E8\u05D1\u05E0\u05D9\u05EA \u05D5\u05D4\u05D0\u05D5\u05D8\u05D5\u05E0\u05D5\u05DE\u05D9\u05D4 \u05D4\u05E9\u05DB\u05DC\u05D9\u05EA \u05E9\u05DC \u05D4\u05D0\u05D3\u05DD \u05D1\u05D4\u05DC\u05DB\u05D4 \u05D5\u05D1\u05D7\u05D5\u05E7. \u05D4\u05E1\u05D9\u05E4\u05D5\u05E8 \u05E2\u05D5\u05E1\u05E7 \u05D1\u05EA\u05E0\u05D5\u05E8\u05D5 \u05E9\u05DC \u05E2\u05DB\u05E0\u05D0\u05D9 \u2013 \u05EA\u05E0\u05D5\u05E8 \u05E7\u05E8\u05DE\u05D9 \u05E9\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05DE\u05D8\u05D4\u05E8 \u05D5\u05D7\u05DB\u05DE\u05D9\u05DD \u05DE\u05D8\u05DE\u05D0\u05D9\u05DD. \u05DC\u05DE\u05E8\u05D5\u05EA \u05E9\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05DE\u05D2\u05D9\u05D9\u05E1 \u05E0\u05E1\u05D9\u05DD \u05D5\u05E0\u05E4\u05DC\u05D0\u05D5\u05EA (\u05D4\u05E4\u05D9\u05DB\u05EA \u05DB\u05D9\u05D5\u05D5\u05DF \u05E0\u05D4\u05E8\u05D5\u05EA, \u05E7\u05D5\u05DC \u05D0\u05DC\u05D5\u05D4\u05D9 \u05D9\u05E9\u05D9\u05E8), \u05E8\u05D1\u05D9 \u05D9\u05D4\u05D5\u05E9\u05E2 \u05E7\u05D5\u05D1\u05E2 \u05D0\u05EA \u05DB\u05DC\u05DC \u05D4\u05D9\u05E1\u05D5\u05D3 \u05D4\u05DE\u05D4\u05E4\u05DB\u05E0\u05D9: '\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0'. \u05D1\u05E8\u05D2\u05E2 \u05E9\u05E0\u05D9\u05EA\u05E0\u05D4 \u05D4\u05EA\u05D5\u05E8\u05D4 \u05DC\u05D1\u05E0\u05D9 \u05D0\u05D3\u05DD \u05D1\u05E1\u05D9\u05E0\u05D9, \u05D0\u05DC\u05D5\u05D4\u05D9\u05DD \u05D0\u05D9\u05E0\u05D5 \u05DE\u05E9\u05DE\u05E9 \u05E2\u05D5\u05D3 \u05DB\u05E2\u05E8\u05DB\u05D0\u05EA \u05E2\u05E8\u05E2\u05D5\u05E8 \u05E2\u05DC \u05D4\u05D7\u05D5\u05E7; \u05D4\u05D7\u05D5\u05E7 \u05E0\u05E7\u05D1\u05E2 \u05DC\u05E4\u05D9 \u05E8\u05D5\u05D1 \u05D3\u05E2\u05D5\u05EA \u05D5\u05E9\u05DB\u05DC \u05D0\u05E0\u05D5\u05E9\u05D9.",
    legalPrinciples: [
      {
        conceptEn: "Rule of Majority Rule (\u05D0\u05D7\u05E8\u05D9 \u05E8\u05D1\u05D9\u05DD \u05DC\u05D4\u05D8\u05D5\u05EA)",
        conceptHe: "\u05D0\u05D7\u05E8\u05D9 \u05E8\u05D1\u05D9\u05DD \u05DC\u05D4\u05D8\u05D5\u05EA",
        applicationEn: "Judicial decisions must follow the logical consensus of the majority, even when a single dissenter is objectively supported by divine miracles.",
        applicationHe: "\u05D4\u05DB\u05E8\u05E2\u05D4 \u05DE\u05E9\u05E4\u05D8\u05D9\u05EA \u05DE\u05EA\u05E7\u05D1\u05DC\u05EA \u05D0\u05DA \u05D5\u05E8\u05E7 \u05E2\u05DC \u05E4\u05D9 \u05D4\u05E8\u05D5\u05D1 \u05D4\u05D3\u05DE\u05D5\u05E7\u05E8\u05D8\u05D9 \u05D1\u05D1\u05D9\u05EA \u05D4\u05D3\u05D9\u05DF, \u05D2\u05DD \u05DE\u05D5\u05DC \u05D3\u05E2\u05EA \u05D9\u05D7\u05D9\u05D3 \u05D4\u05E0\u05EA\u05DE\u05DB\u05EA \u05D1\u05D0\u05D5\u05EA\u05D5\u05EA \u05E9\u05DE\u05D9\u05D9\u05DE\u05D9\u05D9\u05DD."
      },
      {
        conceptEn: "Separation of Divine and Human Law (\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0)",
        conceptHe: "\u05DC\u05D0 \u05D1\u05E9\u05DE\u05D9\u05DD \u05D4\u05D9\u05D0",
        applicationEn: "The legal codes of Torah are administered by human intellect and logic patterns, meaning earthly courts possess binding authority over hermeneutics.",
        applicationHe: "\u05D4\u05E1\u05DE\u05DB\u05D5\u05EA \u05D4\u05D1\u05DC\u05E2\u05D3\u05D9\u05EA \u05DC\u05E7\u05E8\u05D9\u05D0\u05D4, \u05E4\u05D9\u05E8\u05D5\u05E9 \u05D5\u05D1\u05D9\u05D0\u05D5\u05E8 \u05D4\u05DE\u05E9\u05E4\u05D8 \u05DE\u05E1\u05D5\u05E8\u05D4 \u05DC\u05D1\u05E0\u05D9 \u05D4\u05D0\u05D3\u05DD \u05D1\u05E2\u05D5\u05DC\u05DD \u05D4\u05D6\u05D4 \u05DE\u05D9\u05D5\u05DD \u05E7\u05D1\u05DC\u05EA \u05D4\u05EA\u05D5\u05E8\u05D4 \u05D1\u05E1\u05D9\u05E0\u05D9."
      }
    ]
  },
  "berakhot-2a": {
    title: "The Evening Shema / \u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2 \u05E9\u05DC \u05E2\u05E8\u05D1\u05D9\u05EA",
    tractate: "Berakhot 2a",
    category: "Mishna (\u05DE\u05E9\u05E0\u05D4)",
    sages: [
      {
        nameEn: "Rabbi Eliezer ben Hurcanus",
        nameHe: "\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05D1\u05DF \u05D4\u05D5\u05E8\u05E7\u05E0\u05D5\u05E1",
        role: "Tanna",
        descriptionEn: "A dominant 1st-generation Mishnaic sage who rules strictly that the evening Shema must be recited until the end of the first night watch.",
        descriptionHe: "\u05EA\u05E0\u05D0 \u05D2\u05D3\u05D5\u05DC \u05DE\u05D4\u05D3\u05D5\u05E8 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF, \u05E4\u05D5\u05E1\u05E7 \u05E9\u05D6\u05DE\u05DF \u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2 \u05E9\u05DC \u05E2\u05E8\u05D1\u05D9\u05EA \u05D4\u05D9\u05D0 \u05D0\u05DA \u05D5\u05E8\u05E7 \u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05D0\u05E9\u05DE\u05D5\u05E8\u05D4 \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05E9\u05DC \u05D4\u05DC\u05D9\u05DC\u05D4 (\u05E9\u05DC\u05D9\u05E9 \u05E8\u05D0\u05E9\u05D5\u05DF)."
      },
      {
        nameEn: "Rabban Gamliel of Yavneh",
        nameHe: "\u05E8\u05D1\u05DF \u05D2\u05DE\u05DC\u05D9\u05D0\u05DC \u05D3\u05D9\u05D1\u05E0\u05D4",
        role: "Tanna",
        descriptionEn: "The leader (Nasi) of the Yavneh academy who rules the Shema can be read throughout the entire night until the crack of dawn.",
        descriptionHe: "\u05E0\u05E9\u05D9\u05D0 \u05D4\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF \u05D1\u05D9\u05D1\u05E0\u05D4, \u05DE\u05EA\u05D9\u05E8 \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05E9\u05DE\u05E2 \u05E9\u05DC \u05E2\u05E8\u05D1\u05D9\u05EA \u05DC\u05D0\u05D5\u05E8\u05DA \u05DB\u05DC \u05D4\u05DC\u05D9\u05DC\u05D4 \u05DB\u05D5\u05DC\u05D5, \u05E2\u05D3 \u05E9\u05D9\u05E2\u05DC\u05D4 \u05E2\u05DE\u05D5\u05D3 \u05D4\u05E9\u05D7\u05E8."
      }
    ],
    keywords: [
      {
        term: "\u05DE\u05D0\u05D9\u05DE\u05EA\u05D9",
        meaningEn: "From when?",
        meaningHe: "\u05DE\u05DE\u05EA\u05D9 (\u05DE\u05D0\u05D9\u05D6\u05D4 \u05D6\u05DE\u05DF)?",
        functionEn: "Initiates helper chronological legal inquiry to establish active obligation start frames",
        functionHe: "\u05E9\u05D0\u05DC\u05D4 \u05DC\u05E4\u05EA\u05D9\u05D7\u05EA \u05D3\u05D9\u05D5\u05DF \u05D4\u05DC\u05DB\u05EA\u05D9 \u05D1\u05E0\u05D5\u05D2\u05E2 \u05DC\u05D6\u05DE\u05E0\u05D9 \u05E7\u05D9\u05D5\u05DD \u05D4\u05DE\u05E6\u05D5\u05D5\u05EA"
      },
      {
        term: "\u05D3\u05D1\u05E8\u05D9 \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8",
        meaningEn: "Words of Rabbi Eliezer",
        meaningHe: "\u05DC\u05E4\u05D9 \u05E9\u05D9\u05D8\u05EA\u05D5 \u05E9\u05DC \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8",
        functionEn: "Attributes helper legal position or ruling to helper specific Tanna",
        functionHe: "\u05DE\u05E6\u05D9\u05D9\u05DF \u05D9\u05D9\u05D7\u05D5\u05E1 \u05E4\u05E1\u05E7 \u05D4\u05DC\u05DB\u05D4 \u05E1\u05E4\u05E6\u05D9\u05E4\u05D9 \u05DC\u05D3\u05E2\u05EA \u05EA\u05E0\u05D0 \u05D9\u05D7\u05D9\u05D3\u05D9 \u05D1\u05DE\u05E9\u05E0\u05D4"
      }
    ],
    discussionFlow: [
      {
        stepNumber: 1,
        stageEn: "Initial Inquiry (\u05E9\u05D0\u05DC\u05D4)",
        stageHe: "\u05E4\u05EA\u05D9\u05D7\u05EA \u05D3\u05D9\u05D5\u05DF \u05D5\u05E9\u05D0\u05DC\u05D4",
        detailsEn: "Cites the opening question of the whole Talmud: From when do we recite the evening Shema?",
        detailsHe: '\u05DE\u05E2\u05DC\u05D4 \u05D0\u05EA \u05D4\u05E9\u05D0\u05DC\u05D4 \u05D4\u05DE\u05E8\u05DB\u05D6\u05D9\u05EA \u05E9\u05E4\u05EA\u05D7\u05D4 \u05D0\u05EA \u05DE\u05E4\u05E8\u05E1 \u05E9"\u05E1 \u05D1\u05D1\u05DC\u05D9 \u05DB\u05D5\u05DC\u05D5: \u05DE\u05D0\u05D9\u05D6\u05D4 \u05D6\u05DE\u05DF \u05D1\u05E2\u05E8\u05D1 \u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05EA \u05E9\u05DE\u05E2?'
      },
      {
        stepNumber: 2,
        stageEn: "Starting Benchmark (\u05DE\u05D9\u05DE\u05E8\u05D0)",
        stageHe: "\u05E7\u05D1\u05D9\u05E2\u05EA \u05E0\u05E7\u05D5\u05D3\u05EA \u05D4\u05EA\u05D7\u05DC\u05D4",
        detailsEn: "Defines the onset: from the time the Cohanim enter to eat their pure terumah offerings after sunset.",
        detailsHe: "\u05DE\u05D2\u05D3\u05D9\u05E8 \u05E7\u05E8\u05D9\u05D8\u05E8\u05D9\u05D5\u05DF \u05D4\u05DC\u05DB\u05EA\u05D9 \u05D0\u05D7\u05D9\u05D3 \u05DC\u05EA\u05D7\u05D9\u05DC\u05EA \u05D4\u05E2\u05E8\u05D1: \u05DE\u05E9\u05E2\u05D4 \u05E9\u05D4\u05DB\u05D4\u05E0\u05D9\u05DD \u05E9\u05E0\u05D8\u05DE\u05D0\u05D5 \u05D5\u05E0\u05D8\u05D1\u05DC\u05D5 \u05E0\u05DB\u05E0\u05E1\u05D9\u05DD \u05DC\u05D0\u05DB\u05D5\u05DC \u05E9\u05D5\u05D1 \u05D1\u05EA\u05E8\u05D5\u05DE\u05EA\u05DD \u05D4\u05D8\u05D4\u05D5\u05E8\u05D4."
      },
      {
        stepNumber: 3,
        stageEn: "Opinion Dispute (\u05EA\u05E9\u05D5\u05D1\u05D4)",
        stageHe: "\u05DE\u05D7\u05DC\u05D5\u05E7\u05EA \u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05D4\u05D4\u05DC\u05DB\u05EA\u05D9\u05EA",
        detailsEn: "Presents helper tri-way dispute over the final deadline: Rabbi Eliezer limits it to the first watch; Sages extend to midnight; Rabban Gamliel allows up to dawn.",
        detailsHe: "\u05D4\u05E6\u05D2\u05EA \u05E9\u05DC\u05D5\u05E9 \u05D4\u05D3\u05E2\u05D5\u05EA \u05E9\u05DC \u05D7\u05DB\u05DE\u05D9\u05DD \u05DC\u05D2\u05D1\u05D9 \u05E9\u05E2\u05EA \u05D4\u05E1\u05D9\u05D5\u05DD: \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05E2\u05D3 \u05E9\u05DC\u05D9\u05E9 \u05D4\u05DC\u05D9\u05DC\u05D4, \u05E9\u05D0\u05E8 \u05D7\u05DB\u05DE\u05D9\u05DD \u05E2\u05D3 \u05D7\u05E6\u05D5\u05EA, \u05D5\u05E8\u05D1\u05DF \u05D2\u05DE\u05DC\u05D9\u05D0\u05DC \u05E2\u05D3 \u05E2\u05DC\u05D5\u05EA \u05D4\u05E9\u05D7\u05E8."
      }
    ],
    lineByLine: [
      {
        original: "\u05DE\u05D0\u05D9\u05DE\u05EA\u05D9 \u05E7\u05D5\u05E8\u05D9\u05DF \u05D0\u05EA \u05E9\u05DE\u05E2 \u05D1\u05E2\u05E8\u05D1\u05D9\u05EA?",
        translationEn: "From what time on does one recite the Shema in the evening?",
        translationHe: "\u05DE\u05D0\u05D9\u05D6\u05D4 \u05D6\u05DE\u05DF \u05D5\u05DE\u05EA\u05D9 \u05DE\u05EA\u05D7\u05D9\u05DC\u05D9\u05DD \u05E7\u05D5\u05E8\u05D0\u05D9\u05DD \u05D0\u05EA \u05E9\u05DE\u05E2 \u05E9\u05DC \u05E2\u05E8\u05D1\u05D9\u05EA?",
        commentaryEn: "The absolute opening of the Oral Torah, beginning with helper practical time question rather than abstract dogmas.",
        commentaryHe: "\u05D4\u05DE\u05E9\u05E4\u05D8 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF \u05E9\u05E4\u05D5\u05EA\u05D7 \u05D0\u05EA \u05D4\u05EA\u05D5\u05E8\u05D4 \u05E9\u05D1\u05E2\u05DC \u05E4\u05D4, \u05D4\u05DE\u05D1\u05DB\u05E8 \u05E2\u05D9\u05E1\u05D5\u05E7 \u05D1\u05D6\u05DE\u05DF \u05D5\u05D1\u05DE\u05E6\u05D5\u05D5\u05EA \u05DE\u05E2\u05E9\u05D9\u05D5\u05EA \u05E2\u05DC \u05E4\u05E0\u05D9 \u05EA\u05D0\u05D5\u05E8\u05D9\u05D5\u05EA \u05EA\u05D0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D5\u05EA \u05DE\u05D5\u05E4\u05E9\u05D8\u05D5\u05EA.",
        talmudicType: "\u05E9\u05D0\u05DC\u05D4"
      },
      {
        original: "\u05DE\u05E9\u05E2\u05D4 \u05E9\u05D4\u05DB\u05D4\u05E0\u05D9\u05DD \u05E0\u05DB\u05E0\u05E1\u05D9\u05DD \u05DC\u05D0\u05DB\u05D5\u05DC \u05D1\u05EA\u05E8\u05D5\u05DE\u05EA\u05DF,",
        translationEn: "From the actual hour when the priests (Cohanim) who were impure enter to eat their Terumah (sacred offerings) again,",
        translationHe: "\u05DE\u05E9\u05E2\u05D4 \u05E9\u05D4\u05DB\u05D4\u05E0\u05D9\u05DD \u05E0\u05DB\u05E0\u05E1\u05D9\u05DD \u05DC\u05D0\u05DB\u05D5\u05DC \u05D1\u05EA\u05E8\u05D5\u05DE\u05EA\u05DF (\u05DC\u05D0\u05D7\u05E8 \u05E9\u05D8\u05D1\u05DC\u05D5 \u05D5\u05D4\u05E2\u05E8\u05D9\u05D1 \u05E9\u05DE\u05E9\u05DD \u05D1\u05E6\u05D0\u05EA \u05D4\u05DB\u05D5\u05DB\u05D1\u05D9\u05DD),",
        commentaryEn: "This is equivalent to the emergence of stars (Tzeit HaKochavim). The Mishna coordinates the astronomical event of nightfall with helper tangible temple ritual.",
        commentaryHe: "\u05D6\u05D4\u05D5 \u05DE\u05D3\u05D3 \u05D6\u05DE\u05DF \u05D7\u05D6\u05D5\u05EA\u05D9 \u05D4\u05DE\u05E7\u05D1\u05D9\u05DC \u05DC\u05E6\u05D0\u05EA \u05D4\u05DB\u05D5\u05DB\u05D1\u05D9\u05DD. \u05D4\u05DE\u05E9\u05E0\u05D4 \u05E7\u05D5\u05E9\u05E8\u05EA \u05D0\u05D9\u05E8\u05D5\u05E2 \u05D0\u05E1\u05D8\u05E8\u05D5\u05E0\u05D5\u05DE\u05D9 \u05D1\u05D9\u05D5\u05DE\u05D9\u05D5\u05DD \u05E2\u05DD \u05E2\u05D5\u05DC\u05DE\u05DD \u05E9\u05DC \u05DB\u05D4\u05E0\u05D9 \u05D4\u05DE\u05E7\u05D3\u05E9.",
        talmudicType: "\u05DE\u05D9\u05DE\u05E8\u05D0"
      },
      {
        original: "\u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05D0\u05E9\u05DE\u05D5\u05E8\u05D4 \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 - \u05D3\u05D1\u05E8\u05D9 \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8.",
        translationEn: "Until the very end of the first night watch (helper third of the night) - these are the words of Rabbi Eliezer.",
        translationHe: "\u05D5\u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05D0\u05E9\u05DE\u05D5\u05E8\u05D4 \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 (\u05E9\u05DC\u05D9\u05E9 \u05E8\u05D0\u05E9\u05D5\u05DF \u05E9\u05DC \u05D4\u05DC\u05D9\u05DC\u05D4) - \u05D0\u05DC\u05D5 \u05D3\u05D1\u05E8\u05D9 \u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8.",
        commentaryEn: "Rabbi Eliezer believes evening is defined by when people congregate to sleep. By the end of the first watch, the public is asleep, marking the end of 'lying down' time.",
        commentaryHe: "\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8 \u05E1\u05D5\u05D1\u05E8 \u05E9\u05D6\u05DE\u05DF \u05E9\u05DB\u05D9\u05D1\u05D4 \u05EA\u05DC\u05D5\u05D9 \u05D1\u05D4\u05E8\u05D2\u05DC\u05D9 \u05D4\u05D0\u05D3\u05DD, \u05D5\u05E2\u05D3 \u05E1\u05D5\u05E3 \u05D4\u05E9\u05DC\u05D9\u05E9 \u05D4\u05E8\u05D0\u05E9\u05D5\u05DF \u05DB\u05D5\u05DC\u05DD \u05DB\u05D1\u05E8 \u05D9\u05E9\u05E0\u05D9\u05DD, \u05D5\u05DC\u05DB\u05DF \u05D7\u05DC\u05E3 \u05D6\u05DE\u05DF '\u05D1\u05E9\u05DB\u05D1\u05DA'.",
        talmudicType: "\u05EA\u05E9\u05D5\u05D1\u05D4"
      },
      {
        original: "\u05D5\u05D7\u05DB\u05DE\u05D9\u05DD \u05D0\u05D5\u05DE\u05E8\u05D9\u05DD: \u05E2\u05D3 \u05D7\u05E6\u05D5\u05EA.",
        translationEn: "But the Sages argue and say: One may recite it until midnight.",
        translationHe: "\u05D5\u05D7\u05DB\u05DE\u05D9\u05DD \u05D0\u05D7\u05E8\u05D9\u05DD \u05D0\u05D5\u05DE\u05E8\u05D9\u05DD: \u05DE\u05D5\u05EA\u05E8 \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D0\u05D5\u05EA\u05D4 \u05E2\u05D3 \u05D7\u05E6\u05D5\u05EA \u05D4\u05DC\u05D9\u05DC\u05D4.",
        commentaryEn: "The majority of Sages restrict the timeframe to midnight. This exists as helper safeguard (Seyag) to prevent helper person from delaying and sleeping past dawn.",
        commentaryHe: "\u05D3\u05E2\u05EA \u05D4\u05E8\u05D5\u05D1 \u05DE\u05E6\u05DE\u05E6\u05DE\u05EA \u05D0\u05EA \u05D4\u05D2\u05D1\u05D5\u05DC \u05DC\u05D7\u05E6\u05D5\u05EA \u05D4\u05DC\u05D9\u05DC\u05D4. \u05D6\u05D4\u05D5 \u05E1\u05D9\u05D9\u05D2 \u05DC\u05D7\u05D5\u05E7 \u05DC\u05E2\u05D5\u05D3\u05D3 \u05D1\u05E0\u05D9 \u05D0\u05D3\u05DD \u05DC\u05E7\u05E8\u05D5\u05D0 \u05D1\u05D6\u05DE\u05DF \u05D5\u05DC\u05D0 \u05DC\u05D3\u05D7\u05D5\u05EA \u05DC\u05D1\u05D5\u05E7\u05E8.",
        talmudicType: "\u05EA\u05D9\u05E8\u05D5\u05E5"
      },
      {
        original: "\u05E8\u05D1\u05DF \u05D2\u05DE\u05DC\u05D9\u05D0\u05DC \u05D0\u05D5\u05DE\u05E8: \u05E2\u05D3 \u05E9\u05D9\u05E2\u05DC\u05D4 \u05E2\u05DE\u05D5\u05D3 \u05D4\u05E9\u05D7\u05E8.",
        translationEn: "Rabban Gamliel rules: One may continue to recite the Shema until the ascent of the dawn star (crack of dawn).",
        translationHe: "\u05D5\u05E8\u05D1\u05DF \u05D2\u05DE\u05DC\u05D9\u05D0\u05DC \u05D0\u05D5\u05DE\u05E8: \u05DE\u05D5\u05EA\u05E8 \u05DC\u05E7\u05E8\u05D0 \u05D7\u05D9\u05D4 \u05DC\u05DB\u05DC \u05D0\u05D5\u05E8\u05DA \u05D4\u05DC\u05D9\u05DC\u05D4 \u05E2\u05D3 \u05E9\u05D9\u05E2\u05DC\u05D4 \u05E2\u05DE\u05D5\u05D3 \u05D4\u05E9\u05D7\u05E8.",
        commentaryEn: "Rabban Gamliel asserts that from helper Torah perspective, the entire night is legally categorized as 'lying down' timeframe.",
        commentaryHe: "\u05E8\u05D1\u05DF \u05D2\u05DE\u05DC\u05D9\u05D0\u05DC \u05E1\u05D5\u05D1\u05E8 \u05E9\u05DE\u05D4\u05EA\u05D5\u05E8\u05D4 \u05D4\u05DC\u05D9\u05DC\u05D4 \u05DB\u05D5\u05DC\u05D5 \u05DE\u05D5\u05D2\u05D3\u05E8 \u05DB\u05D6\u05DE\u05DF \u05E9\u05DB\u05D9\u05D1\u05D4, \u05D5\u05E8\u05E7 \u05E1\u05D9\u05D9\u05D2 \u05D4\u05DE\u05E7\u05D3\u05E9 \u05D4\u05D2\u05D1\u05D9\u05DC \u05D0\u05EA \u05DE\u05D9\u05D3\u05EA \u05D7\u05DB\u05DE\u05D9\u05DD \u05D0\u05D7\u05E8\u05D9\u05DD.",
        talmudicType: "\u05EA\u05E9\u05D5\u05D1\u05D4"
      }
    ],
    overallExplanationEn: "This iconic opening Mishna of the entire Talmud (Tractate Berakhot) discusses the parameters of the evening Shema recitation. Instead of starting with theological axioms, our Sages root human obligation in the visual cues of the physical world\u2014sunset, the watch-turns of the night, and dawn. The dispute reflects helper deeper philosophical disagreement on how rabbinic legislation coordinates with nature: does ritual time track human sociological habits (Rabbi Eliezer), helper secure safeguard margin (the Sages), or astronomical boundaries (Rabban Gamliel)?",
    overallExplanationHe: '\u05D4\u05DE\u05E9\u05E0\u05D4 \u05D4\u05E4\u05D5\u05EA\u05D7\u05EA \u05E9\u05DC \u05E9"\u05E1 \u05D1\u05D1\u05DC\u05D9 \u05DB\u05D5\u05DC\u05D5 \u05E2\u05D5\u05E1\u05E7\u05EA \u05D1\u05E7\u05D1\u05D9\u05E2\u05EA \u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC \u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2 \u05E9\u05DC \u05E2\u05E8\u05D1\u05D9\u05EA. \u05D1\u05DE\u05E7\u05D5\u05DD \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1\u05E2\u05D9\u05D5\u05DF \u05E4\u05D9\u05DC\u05D5\u05E1\u05D5\u05E4\u05D9 \u05DE\u05D5\u05E4\u05E9\u05D8, \u05D7\u05DB\u05DE\u05D9\u05DD \u05E7\u05D5\u05D1\u05E2\u05D9\u05DD \u05D0\u05EA \u05D7\u05D5\u05D1\u05EA \u05D4\u05D0\u05D3\u05DD \u05D1\u05D0\u05DE\u05E6\u05E2\u05D5\u05EA \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05DE\u05D5\u05D7\u05E9\u05D9\u05DD \u05D1\u05E2\u05D5\u05DC\u05DD \u2013 \u05E6\u05D0\u05EA \u05D4\u05DB\u05D5\u05DB\u05D1\u05D9\u05DD, \u05E9\u05E2\u05D5\u05EA \u05D4\u05E9\u05DE\u05D9\u05E8\u05D4 \u05D1\u05DC\u05D9\u05DC\u05D4 \u05D5\u05D6\u05E8\u05D9\u05D7\u05EA \u05D4\u05E9\u05DE\u05E9. \u05D4\u05DE\u05D7\u05DC\u05D5\u05E7\u05EA \u05DE\u05E9\u05E7\u05E4\u05EA \u05D4\u05D1\u05E0\u05D4 \u05E2\u05DE\u05D5\u05E7\u05D4 \u05DB\u05D9\u05E6\u05D3 \u05E8\u05D9\u05D8\u05D5\u05D0\u05DC \u05D6\u05DE\u05E0\u05D9 \u05E0\u05E7\u05E9\u05E8 \u05DC\u05D8\u05D1\u05E2 \u05D4\u05D0\u05D3\u05DD: \u05D4\u05D0\u05DD \u05D4\u05D6\u05DE\u05DF \u05DE\u05D5\u05D2\u05D3\u05E8 \u05DC\u05E4\u05D9 \u05D4\u05E8\u05D2\u05DC\u05D9 \u05D4\u05D0\u05E0\u05E9\u05D9\u05DD (\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8), \u05E1\u05D9\u05D9\u05D2 \u05D4\u05D2\u05E0\u05D4 \u05D1\u05D8\u05D9\u05D7\u05D5\u05EA\u05D9 (\u05D7\u05DB\u05DE\u05D9\u05DD) \u05D0\u05D5 \u05D2\u05D1\u05D5\u05DC\u05D5\u05EA \u05D4\u05D8\u05D1\u05E2 (\u05E8\u05D1\u05DF \u05D2\u05DE\u05DC\u05D9\u05D0\u05DC)?',
    legalPrinciples: [
      {
        conceptEn: "Building a Fence around Torah (\u05E1\u05D9\u05D9\u05D2 \u05DC\u05EA\u05D5\u05E8\u05D4)",
        conceptHe: "\u05DC\u05E2\u05E9\u05D5\u05EA \u05E1\u05D9\u05D9\u05D2 \u05DC\u05EA\u05D5\u05E8\u05D4",
        applicationEn: "Creating helper buffer margin (like restricting midnight) to protect helper person from accidentally transgressing biblical obligations.",
        applicationHe: "\u05D9\u05E6\u05D9\u05E8\u05EA \u05E9\u05D8\u05D7 \u05D4\u05D2\u05E0\u05D4 \u05D4\u05DC\u05DB\u05EA\u05D9 (\u05DB\u05DE\u05D5 \u05D4\u05D2\u05D1\u05DC\u05EA \u05E7\u05E8\u05D9\u05D0\u05D4 \u05E2\u05D3 \u05D7\u05E6\u05D5\u05EA) \u05DB\u05D3\u05D9 \u05DC\u05DE\u05E0\u05D5\u05E2 \u05DE\u05D0\u05D3\u05DD \u05DC\u05D4\u05EA\u05E8\u05E9\u05DC \u05D5\u05DC\u05E9\u05DB\u05D5\u05D7 \u05E2\u05D3 \u05E2\u05DC\u05D5\u05EA \u05D4\u05E9\u05D7\u05E8."
      },
      {
        conceptEn: "Subjective vs. Secular Time (\u05D6\u05DE\u05DF \u05D8\u05D1\u05E2\u05D9 \u05DE\u05D5\u05DC \u05D0\u05E0\u05D5\u05E9\u05D9)",
        conceptHe: "\u05D6\u05DE\u05E0\u05D9\u05DD \u05D4\u05DC\u05DB\u05EA\u05D9\u05D9\u05DD \u05D5\u05DE\u05E9\u05EA\u05E0\u05D9\u05DD",
        applicationEn: "Determining if religious boundaries rely on human congregation shifts or strict astronomical watches.",
        applicationHe: "\u05D3\u05D9\u05D5\u05DF \u05D4\u05D0\u05DD \u05E7\u05D1\u05D9\u05E2\u05EA \u05D6\u05DE\u05E0\u05D9 \u05D4\u05DC\u05DB\u05D4 \u05E0\u05D5\u05D1\u05E2\u05EA \u05DE\u05E4\u05E2\u05D9\u05DC\u05D5\u05EA \u05E4\u05D9\u05D6\u05D9\u05EA \u05E9\u05DC \u05D1\u05E0\u05D9 \u05D0\u05D3\u05DD \u05D0\u05D5 \u05E9\u05DE\u05D0 \u05DE\u05D7\u05D5\u05E7\u05D9 \u05D0\u05E1\u05D8\u05E8\u05D5\u05E0\u05D5\u05DE\u05D9\u05D4 \u05D9\u05E6\u05D9\u05D1\u05D9\u05DD."
      }
    ]
  }
};

// server.ts
import_dotenv.default.config();
function findMockAnalysis(text) {
  const clean = text.trim().replace(/\s+/g, "");
  if (clean.includes("\u05E9\u05E0\u05D9\u05DD\u05D0\u05D5\u05D7\u05D6\u05D9\u05DF\u05D1\u05D8\u05DC\u05D9\u05EA")) {
    return mockAnalyses["bava-metzia-2a"];
  }
  if (clean.includes("\u05D1\u05D0\u05D5\u05EA\u05D5\u05D4\u05D9\u05D5\u05DD\u05D4\u05E9\u05D9\u05D1\u05E8\u05D1\u05D9\u05D0\u05DC\u05D9\u05E2\u05D6\u05E8")) {
    return mockAnalyses["oven-of-akhnai"];
  }
  if (clean.includes("\u05DE\u05D0\u05D9\u05DE\u05EA\u05D9\u05E7\u05D5\u05E8\u05D9\u05DF\u05D0\u05EA\u05E9\u05DE\u05E2")) {
    return mockAnalyses["berakhot-2a"];
  }
  return null;
}
var getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
  }
  return new import_genai.GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "5mb" }));
  app.get("/api/config-check", (req, res) => {
    res.json({ hasApiKey: !!process.env.GEMINI_API_KEY });
  });
  app.post("/api/explain-talmud", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Missing or invalid 'text' in request body." });
      }
      const mockResult = findMockAnalysis(text);
      if (mockResult) {
        console.log("Serving mock high-fidelity offline analysis for standard sample...");
        return res.json(mockResult);
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: "GEMINI_API_KEY secret is not configured. Please set it in Settings > Secrets to parse custom passages, or select one of the leather-stamped classic studies above to commence instantly!"
        });
      }
      console.log(`Analyzing Talmud passage of length: ${text.length}`);
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert scholar of the Talmud, fluent in Aramaic (Babylonian and Jerusalem Talmud dialects), Rabbinic Hebrew, Modern Hebrew, and English.
Analyze the following copied Talmud passage. If the text contains Rashi, Tosafot, or Mishna, identify and analyze them correctly.
Pasted text:
"""
${text}
"""`,
        config: {
          systemInstruction: "You are an assistant that analyzes copied Talmud text. Extract its properties (Tractate name, Daf, Sages mentioned, original structure/logical flow, line-by-line translation and commentary, keywords/vocabulary) in BOTH English and Modern Hebrew so that the client application can toggle languages instantly. Return the results in structured JSON according to the schema provided.",
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: {
                type: import_genai.Type.STRING,
                description: "A short descriptive title for this Talmudic passage in both English and Hebrew (e.g. 'The Oven of Akhnai / \u05EA\u05E0\u05D5\u05E8\u05D5 \u05E9\u05DC \u05E2\u05DB\u05E0\u05D0\u05D9')"
              },
              tractate: {
                type: import_genai.Type.STRING,
                description: "The tractate name, daf, or specific folio reference if recognized, or 'Not specifically identified' if uncertain."
              },
              category: {
                type: import_genai.Type.STRING,
                description: "A categorization such as Mishna, Gemara, Halakha, Aggadah, mixed, or featuring Commentaries like Rashi/Tosafot."
              },
              sages: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    nameEn: { type: import_genai.Type.STRING, description: "Name of the Sage in English (e.g. 'Rava', 'Rabbi Eliezer')" },
                    nameHe: { type: import_genai.Type.STRING, description: "Name of the Sage in Hebrew (e.g. '\u05E8\u05D1\u05D0', '\u05E8\u05D1\u05D9 \u05D0\u05DC\u05D9\u05E2\u05D6\u05E8')" },
                    role: { type: import_genai.Type.STRING, description: "Amora, Tanna, Sage, or Commentator" },
                    descriptionEn: { type: import_genai.Type.STRING, description: "Brief description of their view, action, or bio in this context in English" },
                    descriptionHe: { type: import_genai.Type.STRING, description: "Brief description of their view, action, or bio in this context in Hebrew" }
                  },
                  required: ["nameEn", "nameHe", "role", "descriptionEn", "descriptionHe"]
                },
                description: "List of Sages/Rabbis mentioned in this text or related commentators."
              },
              keywords: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    term: { type: import_genai.Type.STRING, description: "The Aramaic or Rabbinic Hebrew term/phrase as it appears (e.g. '\u05EA\u05D9\u05E7\u05D5', '\u05E4\u05E9\u05D9\u05D8\u05D0')" },
                    meaningEn: { type: import_genai.Type.STRING, description: "Translation/meaning in English" },
                    meaningHe: { type: import_genai.Type.STRING, description: "Translation/meaning in Modern Hebrew" },
                    functionEn: { type: import_genai.Type.STRING, description: "Hermeneutic action or rhetorical role of this term in English (e.g., 'Introduces query', 'Indicates query was resolved')" },
                    functionHe: { type: import_genai.Type.STRING, description: "Hermeneutic action or rhetorical role of this term in Hebrew" }
                  },
                  required: ["term", "meaningEn", "meaningHe", "functionEn", "functionHe"]
                },
                description: "Key Talmudic Aramaic keywords or legal/hermeneutic terms used or implicit in this passage."
              },
              discussionFlow: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    stepNumber: { type: import_genai.Type.INTEGER, description: "Sequential position of this logical turn in the debate" },
                    stageEn: { type: import_genai.Type.STRING, description: "The logical category (e.g. 'Statement', 'Query', 'Objection', 'Refutation', 'Resolution')" },
                    stageHe: { type: import_genai.Type.STRING, description: "The logical category in Hebrew (e.g. '\u05DE\u05D9\u05DE\u05E8\u05D0', '\u05D1\u05E2\u05D9\u05D0', '\u05E7\u05E9\u05D9\u05D0', '\u05EA\u05D9\u05E8\u05D5\u05E5')" },
                    detailsEn: { type: import_genai.Type.STRING, description: "Explanation of what is happening logically here in English" },
                    detailsHe: { type: import_genai.Type.STRING, description: "Explanation of what is happening logically here in Hebrew" }
                  },
                  required: ["stepNumber", "stageEn", "stageHe", "detailsEn", "detailsHe"]
                },
                description: "Step-by-step description of the rhetorical flow of the Talmudic argument (Shakla Vetarya)."
              },
              lineByLine: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    original: { type: import_genai.Type.STRING, description: "A sentence or phrase from the original text snippet" },
                    translationEn: { type: import_genai.Type.STRING, description: "English translation" },
                    translationHe: { type: import_genai.Type.STRING, description: "Modern Hebrew translation of this phrase" },
                    commentaryEn: { type: import_genai.Type.STRING, description: "Elaboration / parenthetical context for this phrase in English" },
                    commentaryHe: { type: import_genai.Type.STRING, description: "Elaboration / parenthetical context for this phrase in Hebrew" },
                    talmudicType: {
                      type: import_genai.Type.STRING,
                      description: "The primary legal, logical, or rhetorical category of this specific segment. MUST be one of: '\u05DE\u05D9\u05DE\u05E8\u05D0' (Statement), '\u05E7\u05D5\u05E9\u05D9\u05D0' (Objection/Challenge), '\u05EA\u05D9\u05E8\u05D5\u05E5' (Resolution/Defense), '\u05E9\u05D0\u05DC\u05D4' (Query/Question), '\u05EA\u05E9\u05D5\u05D1\u05D4' (Decision/Directive), '\u05E8\u05D0\u05D9\u05D4' (Proof/Evidence)."
                    }
                  },
                  required: ["original", "translationEn", "translationHe", "commentaryEn", "commentaryHe", "talmudicType"]
                },
                description: "A clause-by-clause translation and explanation of the actual pasted text."
              },
              overallExplanationEn: {
                type: import_genai.Type.STRING,
                description: "High-quality, complete context and explanation of the debate/narrative in English, discussing background and halakhic/philosophical outcomes."
              },
              overallExplanationHe: {
                type: import_genai.Type.STRING,
                description: "High-quality, complete context and explanation of the debate/narrative in Hebrew, discussing background and halakhic/philosophical outcomes."
              },
              legalPrinciples: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    conceptEn: { type: import_genai.Type.STRING, description: "The core rule or abstract concept in English (e.g. 'Unintentional intellectual property infringement')" },
                    conceptHe: { type: import_genai.Type.STRING, description: "The core rule or abstract concept in Hebrew (e.g. '\u05E8\u05D5\u05D1', '\u05D1\u05E8\u05D9 \u05D5\u05E9\u05DE\u05D0', '\u05D4\u05E4\u05E7\u05E8 \u05D1\u05D9\u05EA \u05D3\u05D9\u05DF')" },
                    applicationEn: { type: import_genai.Type.STRING, description: "How this concept applies to the current passage in English" },
                    applicationHe: { type: import_genai.Type.STRING, description: "How this concept applies to the current passage in Hebrew" }
                  },
                  required: ["conceptEn", "conceptHe", "applicationEn", "applicationHe"]
                },
                description: "General legal or philosophical principles underlying this discussion."
              }
            },
            required: [
              "title",
              "tractate",
              "category",
              "sages",
              "keywords",
              "discussionFlow",
              "lineByLine",
              "overallExplanationEn",
              "overallExplanationHe",
              "legalPrinciples"
            ]
          }
        }
      });
      const responseText = response.text || "";
      let parsedData;
      try {
        parsedData = JSON.parse(responseText.trim());
      } catch (parseErr) {
        console.error("Failed to parse JSON response from Gemini:", responseText);
        return res.status(500).json({
          error: "Failed to parsestructured response from the AI. The text might be formatted incorrectly.",
          rawText: responseText
        });
      }
      res.json(parsedData);
    } catch (error) {
      console.error("Error analyzing Talmud text:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while explaining the Talmud passage."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
