import { randomUUID } from "crypto";

export default {
  beforeCreate(event: any) {
    const { data } = event.params;
    // Admin UI sends empty string for unselected enum — coerce to default
    if (data.rsvpStatus === "" || data.rsvpStatus === null || data.rsvpStatus === undefined) {
      data.rsvpStatus = "pending";
    }
    // Always generate a cryptographically random token, whatever value Strapi's uid may suggest
    data.token = randomUUID();
  },
  beforeUpdate(event: any) {
    const { data } = event.params;
    if (data.rsvpStatus === "") {
      data.rsvpStatus = "pending";
    }
  },
};
