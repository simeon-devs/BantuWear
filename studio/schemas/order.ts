import { defineType, defineField } from 'sanity';

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'userId', title: 'User ID', type: 'string', readOnly: true }),
    defineField({ name: 'userEmail', title: 'User Email', type: 'string', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['PENDING', 'PAID', 'SHIPPED'] },
      initialValue: 'PENDING',
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (USD)',
      type: 'number',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Full Name' },
        { name: 'address', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'Product ID' },
            { name: 'name', type: 'string', title: 'Product Name' },
            { name: 'price', type: 'number', title: 'Unit Price' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'size', type: 'string', title: 'Size' },
            { name: 'image', type: 'string', title: 'Image URL' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'userEmail', subtitle: 'status' },
  },
});
