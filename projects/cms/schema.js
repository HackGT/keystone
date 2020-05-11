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

const readAdminAccess = {
  create: ACCESS_ADMIN,
  read: ACCESS_GENERAL,
  update: ACCESS_ADMIN,
  delete: ACCESS_ADMIN
}

console.log("readAdmin: ",readAdminAccess)

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
    startTime: {
      type: CalendarDay,
    },
    endTime: {
      type: DateTime
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
