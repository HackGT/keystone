const {
  Checkbox,
  DateTime,
  Integer,
  Relationship,
  Select,
  Text,
  Url,
  CalendarDay,
  File
} = require('@keystonejs/fields');

const CloudStorageAdapter = require('./packages/keystone-google-cloud-storage-adapter')

const { Markdown } = require('@keystonejs/fields-markdown');
const { atTracking, byTracking, createdAt, updatedAt } = require('@keystonejs/list-plugins');

require('dotenv').config()

const ACCESS_OPEN = ({ authentication: { item: user } }) => Boolean(!user || (user && user.permissionLevel != 'NONE'));
const ACCESS_GENERAL = ({ authentication: { item: user } }) => Boolean(user && user.permissionLevel != 'NONE');
const ACCESS_TECH_TEAM = ({ authentication: { item: user } }) => Boolean(user && (user.permissionLevel == 'ADMIN' || user.permissionLevel == 'TECH_TEAM'));
const ACCESS_ADMIN = ({ authentication: { item: user } }) => Boolean(user && user.permissionLevel == 'ADMIN');

start = "-----BEGIN PRIVATE KEY-----\n"
msg = process.env.GOOGLE_PRIVATE
end = "\n-----END PRIVATE KEY-----\n"
pem = `${start}${msg}${end}`

cred = {
  "type": "service_account",
  "project_id": "hackgt-cluster",
  "private_key_id": "2c5ac1db5cfa95aa136172d5959affb2f6311051",
  "private_key": pem,
  "client_email": "hackgt-storage@hackgt-cluster.iam.gserviceaccount.com",
  "client_id": "112216606107657666067",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/hackgt-storage%40hackgt-cluster.iam.gserviceaccount.com"
}

var fileAdapter = new CloudStorageAdapter({
  cloudStorage: {
    credentials: cred,
    path: 'uploads/',
    bucket: 'hackgt-cms-files',
    uploadOptions: {
      public: true
    }
  },
  schema: {
    url: true,
  }
})

const IS_ADMIN_OR_FILTER = (user, filter) => {
  if (Boolean(user && user.permissionLevel == 'NONE')) {
    return false;
  } else if (Boolean(user && user.permissionLevel == 'ADMIN')) {
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
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
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

exports.Block = {
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
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Content blocks for website and mobile app',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    slug: {
      type: Text,
      isRequired: true
    },
    content: {
      type: Markdown,
      isRequired: true
    },
    usage: {
      type: Select,
      isRequired: true,
      options: [
        {
          value: 'MOBILE',
          label: 'Mobile app'
        }, {
          value: 'WEB',
          label: 'Website'
        }, {
          value: 'OTHER',
          label: 'Other'
        }
      ]
    },
    hackathon: {
      type: Relationship,
      ref: 'Hackathon.blocks',
      isRequired: true
    }
  },
  adminConfig: {
    defaultColumns: 'name, slug, usage, hackathon',
    defaultSort: 'slug'
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Hackathon = {
  access: {
    create: ACCESS_ADMIN,
    read: ({
      authentication: {
        item: user
      }
    }) => {
      return IS_ADMIN_OR_FILTER(user, { 'isActive': true })
    },
    update: ACCESS_ADMIN,
    delete: ACCESS_ADMIN
  },
  adminDoc: 'All hackathons and their status',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    events: {
      type: Relationship,
      ref: 'Event.hackathon',
      many: true
    },
    blocks: {
      type: Relationship,
      ref: 'Block.hackathon',
      many: true
    },
    faqs: {
      type: Relationship,
      ref: 'FAQ.hackathon',
      many: true
    },
    branding: {
      type: Relationship,
      ref: 'BrandAsset.hackathons',
      many: true
    },
    sponsors: {
      type: Relationship,
      ref: 'Sponsor.hackathon',
      many: true
    },
    challenges: {
      type: Relationship,
      ref: 'Challenge.hackathon',
      many: true
    },
    slackUrl: {
      type: Url
    },
    isActive: {
      type: Checkbox,
      defaultValue: true
    }
  },
  adminConfig: {
    defaultColumns: 'name, isActive'
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Sponsor = {
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
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Sponsors for the hackathon',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    website: {
      type: Url,
      isRequired: true
    },
    originalLogo: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.originalLogo) {
            await fileAdapter.delete(existingItem.originalLogo);
          }
        }
      }
    },
    themedLogo: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.themedLogo) {
            await fileAdapter.delete(existingItem.themedLogo);
          }
        }
      }
    },
    logoSize: {
      type: Select,
      isRequired: true,
      options: [
        {
          value: 'XS',
          label: 'XS'
        },
        {
          value: 'S',
          label: 'S'
        },
        {
          value: 'M',
          label: 'M'
        }, {
          value: 'L',
          label: 'L'
        },
        {
          value: 'XL',
          label: 'XL'
        }
      ],
    },
    tier: {
      type: Select,
      dataType: 'integer',
      options: [
        {
          value: 1,
          label: 'Tier 1'
        },
        {
          value: 2,
          label: 'Tier 2'
        },
        {
          value: 3,
          label: 'Tier 3'
        }, {
          value: 4,
          label: 'Tier 4'
        },
        {
          value: 5,
          label: 'Tier 5'
        }
      ],
    },
    hackathon: {
      type: Relationship,
      ref: 'Hackathon.sponsors',
      isRequired: true
    },
    events: {
      type: Relationship,
      ref: 'Event.sponsors',
      many: true
    },
    perks: {
      type: Relationship,
      ref: 'Perk.sponsors',
      many: true
    },
    challenges: {
      type: Relationship,
      ref: 'Challenge.sponsors',
      many: true
    },
    videoLink: {
      type: Url
    },
    blueJeansLink: {
      type: Url
    },
    moderatorLink: {
      type: Url
    },
    about: {
      type: Markdown,
      isRequired: true
    },
    eventInformation: {
      type: Markdown
    },
    challengeInformation: {
      type: Markdown
    },
    recruiting: {
      type: Markdown
    },
    additionalInfo: {
      type: Markdown
    }
  },
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if (existingItem.originalLogo) {
        await fileAdapter.delete(existingItem.originalLogo);
      }

      if (existingItem.themedLogo) {
        await fileAdapter.delete(existingItem.themedLogo);
      }
    },
  },
  adminConfig: {
    defaultColumns: 'name, website, hackathon'
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Perk = {
  access: {
    create: ACCESS_GENERAL,
    read: ACCESS_OPEN,
    update: ACCESS_GENERAL,
    delete: ACCESS_GENERAL
  },
  adminDoc: 'List of available perks relating to online for sponsors',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    slug: {
      type: Text,
      isRequired: true
    },
    sponsors: {
      type: Relationship,
      ref: "Sponsor.perks",
      many: true
    }
  },
  adminConfig: {
    defaultColumns: 'name, slug'
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Challenge = {
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
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Challenges created/hosted by sponsors',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    prize: {
      type: Text,
      isRequired: true
    },
    description: {
      type: Markdown,
      isRequired: true
    },
    hackathon: {
      type: Relationship,
      ref: "Hackathon.challenges",
      isRequired: true
    },
    sponsors: {
      type: Relationship,
      ref: "Sponsor.challenges",
      many: true
    }
  },
  adminConfig: {
    defaultColumns: 'name, sponsors, hackathon'
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.SocialAccount = {
  access: {
    create: ACCESS_TECH_TEAM,
    read: ACCESS_OPEN,
    update: ACCESS_TECH_TEAM,
    delete: ACCESS_TECH_TEAM
  },
  adminDoc: 'HackGT social media links',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    url: {
      type: Url,
      isRequired: true
    }
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
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
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Schedule of events for current hackathon',
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
      isRequired: true,
      format: 'M/d/yyyy',
      adminDoc: 'Format: MM/DD/YYYY',
      yearRangeFrom: 2020,
      yearRangeTo: 2040
    },
    startTime: {
      type: Select,
      dataType: 'string',
      options: TIMES,
      isRequired: true,
      adminDoc: 'Please search for the time'
    },
    startDate: {
      type: DateTime,
      access: {
        create: false,
        read: true,
        update: false
      }
    },
    endDay: {
      type: CalendarDay,
      isRequired: true,
      format: 'M/d/yyyy',
      adminDoc: 'Format: MM/DD/YYYY',
      yearRangeFrom: 2020,
      yearRangeTo: 2040
    },
    endTime: {
      type: Select,
      dataType: 'string',
      options: TIMES,
      isRequired: true,
      adminDoc: 'Please search for the time'
    },
    endDate: {
      type: DateTime,
      access: {
        create: false,
        read: true,
        update: false
      }
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
    },
    sponsors: {
      type: Relationship,
      ref: 'Sponsor.events',
      many: true
    },
    tags: {
      type: Relationship,
      ref: 'Tag.events',
      many: true
    },
    url: {
      type: Url
    }
  },
  adminConfig: {
    defaultColumns: 'name, startTime, endTime, type, hackathon',
    defaultSort: 'startDate'
  },
  hooks: {
    // Existing Item is the whole event data, while resolved data only holds the changed data
    resolveInput: ({ existingItem, resolvedData }) => {
      const startDay = resolvedData.startDay || (
        existingItem
          ? existingItem.startDay
          : null);
      const startTime = resolvedData.startTime || (
        existingItem
          ? existingItem.startTime
          : null);
      const endDay = resolvedData.endDay || (
        existingItem
          ? existingItem.endDay
          : null);
      const endTime = resolvedData.endTime || (
        existingItem
          ? existingItem.endTime
          : null);

      if (startDay && startTime && endDay && endTime) {
        resolvedData.startDate = new Date(`${startDay} ${startTime} UTC`).toISOString();
        resolvedData.endDate = new Date(`${endDay} ${endTime} UTC`).toISOString();
      }

      return resolvedData;
    }
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Location = {
  access: {
    create: ACCESS_GENERAL,
    read: ACCESS_OPEN,
    update: ACCESS_GENERAL,
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Possible locations for events',
  fields: {
    name: {
      type: Text,
      isRequired: true,
      isReadOnly: !ACCESS_ADMIN
    },
    capacity: {
      type: Integer,
      isReadOnly: !ACCESS_ADMIN
    },
    mapGTSlug: {
      type: Text,
      label: "MapGT Slug"
    }
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Type = {
  access: {
    create: ACCESS_TECH_TEAM,
    read: ACCESS_OPEN,
    update: ACCESS_TECH_TEAM,
    delete: ACCESS_TECH_TEAM
  },
  adminDoc: 'Types of hackathon events',
  fields: {
    name: {
      type: Text,
      isRequired: true
    }
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.Tag = {
  access: {
    create: ACCESS_GENERAL,
    read: ACCESS_OPEN,
    update: ACCESS_GENERAL,
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Description tags used for labeling events',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    events: {
      type: Relationship,
      ref: 'Event.tags',
      many: true
    }
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.BrandAsset = {
  access: {
    create: ACCESS_GENERAL,
    read: ACCESS_OPEN,
    update: ACCESS_GENERAL,
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Branding assets for HackGT',
  fields: {
    name: {
      type: Text,
      isRequired: true
    },
    slug: {
      type: Text,
      isRequired: true
    },
    image: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.image) {
            await fileAdapter.delete(existingItem.image);
          }
        }
      }
    },
    hackathons: {
      type: Relationship,
      ref: 'Hackathon.branding',
      many: true
    },
  },
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ],
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if (existingItem.image) {
        await fileAdapter.delete(existingItem.image);
      }
    }
  }
}

exports.FAQ = {
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
    delete: ACCESS_GENERAL
  },
  adminDoc: 'Questions and answers for website and mobile app',
  fields: {
    question: {
      type: Text,
      isMultiline: true,
      isRequired: true
    },
    answer: {
      type: Text,
      isMultiline: true,
      isRequired: true
    },
    index: {
      type: Integer,
      isRequired: true,
      adminDoc: 'Used to sort the FAQs. Lower numbers come first.'
    },
    hackathon: {
      type: Relationship,
      ref: 'Hackathon.faqs',
      isRequired: true
    }
  },
  adminConfig: {
    defaultSort: 'index',
    defaultColumns: 'question, answer, index, hackathon'
  },
  plural: 'FAQs',
  plugins: [
    atTracking({ access: false }),
    byTracking({ access: false })
  ]
}

exports.User = {
  access: {
    create: ACCESS_ADMIN,
    read: ({
      authentication: {
        item: user
      }
    }) => {
      return IS_ADMIN_OR_FILTER(user, { 'groundTruthId': user.groundTruthId })
    },
    update: ACCESS_ADMIN,
    delete: ACCESS_ADMIN
  },
  adminDoc: 'Users with access to the Admin UI',
  fields: {
    name: {
      type: Text,
      access: readAdminAccess,
      isRequired: true
    },
    email: {
      type: Text,
      access: readAdminAccess,
      isRequired: true
    },
    groundTruthId: {
      type: Text,
      label: 'Ground truth ID',
      access: readAdminAccess,
      isRequired: true
    },
    permissionLevel: {
      type: Select,
      options: [
        {
          value: 'ADMIN',
          label: 'Admin - Can read/write everything'
        }, {
          value: 'TECH_TEAM',
          label: 'Tech Team - Can read/write most things'
        }, {
          value: 'GENERAL',
          label: 'General - Can read/write essentials'
        }, {
          value: 'NONE',
          label: 'None - Cannot view dashboard'
        }
      ],
      access: ACCESS_ADMIN,
      isRequired: true
    }
  },
  adminConfig: {
    defaultColumns: 'name, email, permissionLevel'
  },
  plugins: [
    createdAt(),
    updatedAt({ access: false }),
    byTracking({ access: false })
  ]
}
