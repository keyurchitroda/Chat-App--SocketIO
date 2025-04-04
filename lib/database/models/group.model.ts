import { Schema, model, models } from "mongoose";

const GroupSchema = new Schema(
  {
    joined_user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group_name: { type: String, required: true },
  },
  { timestamps: true }
);

const Group = models.Group || model("Group", GroupSchema);

export default Group;
