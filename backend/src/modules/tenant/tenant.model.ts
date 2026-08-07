import mongoose, { Document, Schema } from "mongoose";
import { TenantPlan } from "../../shared/types/common";

/**
 * Tenant document interface for Mongoose.
 */
export interface ITenant extends Document {
  name: string;
  slug: string;
  domain?: string;
  plan: TenantPlan;
  isActive: boolean;
  settings: {
    maxUsers: number;
    features: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      maxUsers: { type: Number, default: 5 },
      features: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);
