import { ModuleEntity } from "../../domain/entities/module.entity";
import { ModuleDocument } from "../schemas/module.schema";

export const toModuleEntity = (doc: ModuleDocument): ModuleEntity => {
  const obj: any = doc.toObject();

  return new ModuleEntity(
    String(obj._id),
    obj.name,
    obj.shortdescription,
    obj.description,
    obj.content,
    obj.studycredit,
    obj.location,
    obj.contact_id,
    obj.level,
    obj.learningoutcomes ?? [],
    obj.module_tags ?? [],
    obj.popularity_score,
    obj.estimated_difficulty,
    obj.available_spots,
    new Date(obj.start_date),
    new Date(obj.updated_at),
  );
};