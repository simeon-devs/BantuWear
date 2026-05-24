import { defineType, defineField } from 'sanity';

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'passwordHash',
      title: 'Password Hash',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: { list: ['CUSTOMER', 'ADMIN'] },
      initialValue: 'CUSTOMER',
    }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'role' },
  },
});
