export default {
  "kind": "collectionType",
  "collectionName": "guests",
  "info": {
    "singularName": "guest",
    "pluralName": "guests",
    "displayName": "Guest"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name1": { "type": "string", "required": true },
    "name2": { "type": "string" },
    "gender": { "type": "enumeration", "enum": ["male", "female"] },
    "greeting": { "type": "string" },
    "coverMessage": { "type": "text" },
    "token": { "type": "string", "unique": true, "pluginOptions": { "content-manager": { "visible": false } } },
    "rsvpStatus": {
      "type": "enumeration",
      "enum": ["pending", "attending", "declining"],
      "default": "pending"
    },
    "askPartnerAttendance": { "type": "boolean", "default": false },
    "partnerAttending": { "type": "boolean", "pluginOptions": { "content-manager": { "visible": false } } },
    "confirmAttendingSoloTitle": { "type": "string" },
    "confirmAttendingSoloBody": { "type": "text" },
    "confirmAttendingWithPartnerTitle": { "type": "string" },
    "confirmAttendingWithPartnerBody": { "type": "text" },
    "confirmDecliningTitle": { "type": "string" },
    "confirmDecliningBody": { "type": "text" },
    "message": { "type": "text" },
    "respondedAt": { "type": "datetime" },
    "wedding": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::wedding.wedding",
      "inversedBy": "guests"
    }
  }
};
