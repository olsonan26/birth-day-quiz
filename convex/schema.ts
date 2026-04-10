import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  leads: defineTable({
    email: v.optional(v.string()),
    quizScores: v.optional(
      v.object({
        A: v.number(),
        B: v.number(),
        C: v.number(),
        D: v.number(),
      })
    ),
    primaryType: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    emailCaptureStage: v.optional(v.string()), // "pre-quiz", "post-results"
    purchasedAt: v.optional(v.number()),
    source: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_primaryType", ["primaryType"]),
});

export default schema;
