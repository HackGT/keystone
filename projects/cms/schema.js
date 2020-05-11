const {
  Checkbox,
  DateTime,
  Integer,
  Relationship,
  Select,
  Text,
  CalendarDay
} = require('@keystonejs/fields');

const { Markdown } = require('@keystonejs/fields-markdown');

const ACCESS_GENERAL = ({ authentication: { item: user } }) => Boolean(user);
const ACCESS_TECH_TEAM = ({ authentication: { item: user } }) => Boolean(user && user.permissionLevel == 'TECH_TEAM');
const ACCESS_ADMIN = ({ authentication: { item: user } }) => Boolean(user && user.permissionLevel == 'ADMIN');

const IS_ADMIN_OR_FILTER = (user, filter) => {

  if (Boolean(user && user.permissionLevel == 'ADMIN')) {
    return {};
  }

  return filter;
};

const TIMES = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "01:00 AM",
  "01:15 AM",
  "01:30 AM",
  "01:45 AM",
  "02:00 AM",
  "02:15 AM",
  "02:30 AM",
  "02:45 AM",
  "03:00 AM",
  "03:15 AM",
  "03:30 AM",
  "03:45 AM",
  "04:00 AM",
  "04:15 AM",
  "04:30 AM",
  "04:45 AM",
  "05:00 AM",
  "05:15 AM",
  "05:30 AM",
  "05:45 AM",
  "06:00 AM",
  "06:15 AM",
  "06:30 AM",
  "06:45 AM",
  "07:00 AM",
  "07:15 AM",
  "07:30 AM",
  "07:45 AM",
  "08:00 AM",
  "08:15 AM",
  "08:30 AM",
  "08:45 AM",
  "09:00 AM",
  "09:15 AM",
  "09:30 AM",
  "09:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "00:00 PM",
  "00:15 PM",
  "00:30 PM",
  "00:45 PM",
  "01:00 PM",
  "01:15 PM",
  "01:30 PM",
  "01:45 PM",
  "02:00 PM",
  "02:15 PM",
  "02:30 PM",
  "02:45 PM",
  "03:00 PM",
  "03:15 PM",
  "03:30 PM",
  "03:45 PM",
  "04:00 PM",
  "04:15 PM",
  "04:30 PM",
  "04:45 PM",
  "05:00 PM",
  "05:15 PM",
  "05:30 PM",
  "05:45 PM",
  "06:00 PM",
  "06:15 PM",
  "06:30 PM",
  "06:45 PM",
  "07:00 PM",
  "07:15 PM",
  "07:30 PM",
  "07:45 PM",
  "08:00 PM",
  "08:15 PM",
  "08:30 PM",
  "08:45 PM",
  "09:00 PM",
  "09:15 PM",
  "09:30 PM",
  "09:45 PM",
  "10:00 PM",
  "10:15 PM",
  "10:30 PM",
  "10:45 PM",
  "11:00 PM",
  "11:15 PM",
  "11:30 PM",
  "11:45 PM"
]

const readAdminAccess = {
  create: ACCESS_ADMIN,
  read: ACCESS_GENERAL,
  update: ACCESS_ADMIN,
  delete: ACCESS_ADMIN
}

exports.Hackathon = {
  access: {
    create: ACCESS_ADMIN,
    read: ({ authentication: { item: user } }) => {
      return IS_ADMIN_OR_FILTER(user, {
        'isActive': true
      })
    },
    update: ACCESS_ADMIN,
    delete: ACCESS_ADMIN
  },
  fields: {
    name: {
      type: Text
    },
    events: {
      type: Relationship,
      ref: 'Event.hackathon',
      many: true
    },
    isActive: {
      type: Checkbox
    }
  }
}

exports.Event = {
  access: {
    create: ACCESS_GENERAL,
    read: ({ authentication: { item: user } }) => {
      return IS_ADMIN_OR_FILTER(user, {
        'hackathon': {
          'isActive': true
        }
      })
    },
    update: ACCESS_GENERAL,
    delete: ACCESS_GENERAL,
  },
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    hackathon: {
      type: Relationship,
      ref: 'Hackathon.events',
      many: false,
      isRequired: true
    },
    startDay: {
      type: CalendarDay,
      isRequired: true
    },
    startTime: {
      type: Select,
      dataType: 'string',
      options: TIMES,
      isRequired: true
    },
    startDate: {
      type: DateTime,
      access: false
    },
    endDay: {
      type: CalendarDay,
      isRequired: true
    },
    endTime: {
      type: Select,
      dataType: 'string',
      options: TIMES,
      isRequired: true
    },
    endDate: {
      type: DateTime,
      access: false
    },
    description: {
      type: Text,
      isMultiline: true
    },
    type: {
      type: Relationship,
      ref: 'Type'
    },
    location: {
      type: Relationship,
      ref: 'Location',
      many: true
    }
  },
  adminConfig: {
    defaultColumns: 'name, startTime, endTime, type'
  },
  hooks: {
    // Existing Item is the whole event data, while resolved data only holds the changed data
    resolveInput: ({ existingItem, resolvedData }) => {
      const startDay = resolvedData.startDay || existingItem.startDay;
      const startTime = resolvedData.startTime || existingItem.startTime;
      const endDay = resolvedData.endDay || existingItem.endDay;
      const endTime = resolvedData.endTime || existingItem.endTime;

      resolvedData.startDate = new Date(`${startDay} ${startTime} UTC`).toISOString();
      resolvedData.endDate = new Date(`${endDay} ${endTime} UTC`).toISOString();

      return resolvedData;
    }
  }
}

exports.Location = {
  access: ACCESS_GENERAL,
  fields: {
    name: {
      type: Text,
      isRequired: true,
      isReadOnly: !ACCESS_ADMIN
    },
    capacity: {
      type: Integer,
      isReadOnly: !ACCESS_ADMIN
    }
  }
}

exports.Type = {
  access: readAdminAccess,
  fields: {
    name: {
      type: Text,
      isRequired: true,
      access: readAdminAccess
    }
  }
}

exports.FAQ = {
  access: ACCESS_GENERAL,
  fields: {
    question: {
      type: Text,
      isMultiline: true
    },
    answer: {
      type: Text,
      isMultiline: true
    }
  },
  plural: 'FAQs'
}

exports.Block = {
  access: ACCESS_GENERAL,
  fields: {
    name: {
      type: Text
    },
    slug: {
      type: Text
    },
    content: {
      type: Markdown
    }
  }
}


exports.User = {
  access: {
    create: ACCESS_ADMIN,
    read: ({ authentication: { item: user } }) => {
      return IS_ADMIN_OR_FILTER(user, {
        'groundTruthId': user.groundTruthId
      })
    },
    update: ACCESS_ADMIN,
    delete: ACCESS_ADMIN
  },
  fields: {
    name: {
      type: Text,
      access: readAdminAccess
    },
    email: {
      type: Text,
      access: readAdminAccess
    },
    groundTruthId: {
      type: Text,
      label: 'Ground truth ID',
      access: readAdminAccess
    },
    permissionLevel: {
      type: Select,
      options: [
        { value: 'ADMIN', label: 'Admin - Can read/write everything' },
        { value: 'TECH_TEAM', label: 'Tech Team - Can read/write most things' },
        { value: 'GENERAL', label: 'General - Can read/write only essentials' }
      ],
      access: ACCESS_ADMIN
    },
  }
}
