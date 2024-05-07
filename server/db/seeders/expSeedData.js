// /** @type {import{'sequelize-cli'}.Migration} */

const models = require('../models/index');

const Pin = models.pin;
const Content = models.content;
const User = models.user;
const Photo = models.photo;
const Comment = models.comment;
const Plan = models.plan;
const Tag = models.tag;
const Content_tag = models.content_tag;
const Shared_content = models.shared_content;
const Shared_content_status = models.shared_content_status;
const User_vote = models.user_vote;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'a@b.com',
        phone: "123-456-7890",
        firstName: 'Bob',
        lastName: 'Johnson',
        latitude: 29.963864,
        longitude: -90.05213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'Marta@Smith.com',
        phone: '321-654-0987',
        firstName: 'Marta',
        lastName: 'Smith',
        latitude: 29.963864,
        longitude: -90.05213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'Helene@gmail.com',
        phone: '531-994-0987',
        firstName: 'Helene',
        lastName: 'Van Damme',
        latitude: 29.923864,
        longitude: -90.01213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'PeterLF@gmail.com',
        phone: '531-994-0987',
        firstName: 'Peter',
        lastName: 'LeFleur',
        latitude: 29.9423864,
        longitude: -90.06253,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
    ]);

    // TAG id: 1
    await Tag.create({
      tag: 'throws',
    });

    // CREATE CONTENT through contentables to take advantage of associations

    // id: 1
    await Pin.create(
      {
        pinType: 'EMT',
        photoURL: 'www.google.com',
        description: "There's an EMT over here",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: -1,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // id: 2, belongs to content id 1 (above)
    await Photo.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL: 'www.google2.com',
        description: 'This photo is about the EMT pin',
      },
      { include: [Content] }
    );

    // Adding tags to content
    await Content_tag.create({
      tagId: 1,
      contentId: 1,
    });

    await Content_tag.create({
      tagId: 1,
      contentId: 2,
    });

    // id: 3
    await Comment.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: 2,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'This is a nested comment about a photo about a pin',
      },
      { include: [Content] }
    );

    // id: 4
    await Plan.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 1,
          placement: 'public',
          userId: 2,
          parentId: null,
        },
        name: 'Opening Party',
        description: 'Fire Breathing Dragons',
        address: '54 S. South Long Lake Rd, Traverse City, MI, 49685',
        startTime: '2024-04-01T18:00',
        endTime: '2024-04-01T18:00',
        inviteCount: 1,
        attendingCount: 0,
        link: 'www.link.com',
      },
      {
        include: [Content],
      }
    );

    // content id 5
    await Comment.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'This comment is about an EMT pin',
      },
      { include: [Content] }
    );


    // SHARING CONTENT id: 1 (the pin)
    await Shared_content.create({
      contentId: 1,
      senderId: 2,
      recipientId: 1,
    });

    await Shared_content.create({
      contentId: 1,
      senderId: 3,
      recipientId: 1,
    });

    await Shared_content.create({
      contentId: 1,
      senderId: 4,
      recipientId: 1,
    });

    // sharing the plan
    await Shared_content.create({
      contentId: 4,
      senderId: 2,
      recipientId: 1,
    });

    await Shared_content.create({
      contentId: 4,
      senderId: 3,
      recipientId: 1,
    });

    // marking if shared content is archived for user 1
    // the pin is NOT archived
    await Shared_content_status.create({
      contentId: 1,
      userId: 1,
      isArchived: false,
    })

    // the plan is archived
    await Shared_content_status.create({
      contentId: 4,
      userId: 1,
      isArchived: true,
    })

    // up/downvotes from user 1
    await User_vote.create({
      vote: 'up',
      userId: 1,
      contentId: 4,
    })
    await User_vote.create({
      vote: 'down',
      userId: 1,
      contentId: 1,
    })

    // up/downvotes from user 2
    await User_vote.create({
      vote: 'up',
      userId: 2,
      contentId: 4,
    })
    await User_vote.create({
      vote: 'up',
      userId: 2,
      contentId: 1,
    })

    // up/downvotes from user 3
    await User_vote.create({
      vote: 'up',
      userId: 3,
      contentId: 4,
    })
    await User_vote.create({
      vote: 'up',
      userId: 3,
      contentId: 1,
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('');
  },
};
