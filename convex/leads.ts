import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save or update a lead with email (pre-quiz or post-results)
export const saveLead = mutation({
  args: {
    email: v.string(),
    stage: v.string(),
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
  },
  handler: async (ctx, args) => {
    // Check if lead with this email already exists
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing lead
      await ctx.db.patch(existing._id, {
        email: args.email,
        emailCaptureStage: args.stage,
        ...(args.quizScores && { quizScores: args.quizScores }),
        ...(args.primaryType && { primaryType: args.primaryType }),
        ...(args.birthDate && { birthDate: args.birthDate }),
      });
      return existing._id;
    }

    // Create new lead
    return await ctx.db.insert("leads", {
      email: args.email,
      emailCaptureStage: args.stage,
      quizScores: args.quizScores,
      primaryType: args.primaryType,
      birthDate: args.birthDate,
    });
  },
});

// Save quiz results (even without email)
export const saveQuizResults = mutation({
  args: {
    quizScores: v.object({
      A: v.number(),
      B: v.number(),
      C: v.number(),
      D: v.number(),
    }),
    primaryType: v.string(),
    birthDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      quizScores: args.quizScores,
      primaryType: args.primaryType,
      birthDate: args.birthDate,
    });
  },
});

// Get lead stats (for admin)
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    const withEmail = leads.filter((l) => l.email);
    const byType: Record<string, number> = {};
    for (const lead of leads) {
      if (lead.primaryType) {
        byType[lead.primaryType] = (byType[lead.primaryType] || 0) + 1;
      }
    }
    return {
      totalLeads: leads.length,
      withEmail: withEmail.length,
      byType,
    };
  },
});
