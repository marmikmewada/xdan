// "use server"
// import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI; // Ensure this is set in your environment
let isConnected = false; // Track connection state

export async function connectToDatabase(mongoose) {
  console.log("Connecting to database with URI:", MONGO_URI); // Log the URI

  if (mongoose.connection.readyState === 0) {
    try {
      const db = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connected successfully");
      isConnected = db.connection.readyState; // Update connection state
    } catch (error) {
      console.error("Database connection error:", error);
      throw new Error("Could not connect to the database");
    }
  } else {
    console.log("Database already connected");
  }
}

// lib/db.js
export const dbmodels = (mongoose) => {
  // Define the User schema
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      lastName: { type: String, required: true },
      dob: { type: Date, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phone: { type: String, required: true },
      twofa: { type: Boolean, default: true },
      address: { type: String },
      selectedMode: { type: String },
      newsletter: { type: Boolean, default: false },
      couponUsage: [
        { type: mongoose.Schema.Types.ObjectId, ref: "DiscountCoupon" },
      ],
      role: { type: String, enum: ["admin", "user", "staff"], default: "user" },
    },
    { timestamps: true }
  );

  // Define the Product schema
  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  });

  // Define other schemas here (Category, Store, etc.) similarly...
  const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  });

  const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    coordinates: { type: String },
  });

  const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    minutes: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  });

  // Discount Coupon Model
  const discountCouponSchema = new mongoose.Schema({
    couponCode: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true },
    maxUsage: { type: Number, required: true },
    expiry: { type: Date, required: true },
  });

  // Order Model
  const orderSchema = new mongoose.Schema(
    {
      userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      productRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      packageRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
      totalAmount: { type: Number, required: true },
      orderType: {
        type: String,
        enum: ['pickup', 'delivery']
      },
      givenByStaff:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
      statusForUser: { 
        type: String, 
        enum: ['failed','placed', 'ready-for-pickup', 'collected'],  // Possible status values
      },
      detailsFromStripe: { type: Object }, // Store Stripe details if payment was through Stripe
      paymentMethod: { 
        type: String, 
        enum: ['stripe', 'pay-on-pickup'],  // Allowed values: 'stripe' or 'pay-on-pickup'
        required: true
      },
      paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'],  // Payment status (for Stripe, or if user has paid when picking up)
        default: 'pending'
      },
      deliveryAddress: {
        type: String, // True if delivery is selected
      },
      usedCouponCode: {type: mongoose.Schema.Types.ObjectId, ref: "DiscountCoupon"},
      couponDiscountAmount: {type: Number},
    },
    { timestamps: true }
  );
  

  // Newsletter Model
  const newsletterSchema = new mongoose.Schema({
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subscribedAt: { type: Date, default: Date.now },
    email: { type: String, required: true },
    phone: { type: String },
  });

  // Cart Model
  const cartSchema = new mongoose.Schema(
    {
      userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      items: [{ type: mongoose.Schema.Types.ObjectId }],
      // cartTotal: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
  );

  // Booking Model
  const bookingSchema = new mongoose.Schema({
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storeRef: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    date: { type: Date, required: true },
    timeSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ], // Array of time slots (each with startTime and endTime)
    packageRef: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  });

  // Unavailable Slots Model
  const unavailableSlotSchema = new mongoose.Schema({
    storeRef: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    date: { type: Date, required: true },
    slots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        reason: { type: String },
      },
    ], // Array of slots (each with start and end time)
  });

  // Unavailable Days Model
  const unavailableDaySchema = new mongoose.Schema({
    storeRef: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    dates: { type: [Date], required: true }, // Array of dates (multiple unavailable days)
    reason: { type: String },
  });

  // const { userTable, productTable } = dbmodels(mongoose);  ************
  // Add other schemas like packageSchema, orderSchema, etc. here...

  // Return models with corresponding names
  return {
    userTable: mongoose.models.User || mongoose.model("User", userSchema),
    productTable:
      mongoose.models.Product || mongoose.model("Product", productSchema),
    categoryTable:
      mongoose.models.Category || mongoose.model("Category", categorySchema),
    storeTable: mongoose.models.Store || mongoose.model("Store", storeSchema),
    packageTable:
      mongoose.models?.Package || mongoose.model("Package", packageSchema),
    discountCouponTable:
      mongoose.models?.DiscountCoupon ||
      mongoose.model("DiscountCoupon", discountCouponSchema),
    orderTable: mongoose.models?.Order || mongoose.model("Order", orderSchema),
    newsletterTable:
      mongoose.models?.Newsletter ||
      mongoose.model("Newsletter", newsletterSchema),
    cartTable: mongoose.models?.Cart || mongoose.model("Cart", cartSchema),
    bookingTable:
      mongoose.models?.Booking || mongoose.model("Booking", bookingSchema),
    unavailableSlotTable:
      mongoose.models?.UnavailableSlot ||
      mongoose.model("UnavailableSlot", unavailableSlotSchema),
    unavailableDayTable:
      mongoose.models?.UnavailableDay ||
      mongoose.model("UnavailableDay", unavailableDaySchema),

    // Add other models here like:
    // packageTable, discountCouponTable, orderTable, etc.
  };
};

//  const userSchema= new mongoose.Schema({
//         name: { type: String, required: true },
//         lastName: { type: String, required: true },
//         dob: { type: Date, required: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//         phone: { type: String, required: true },
//         twofa: { type: Boolean, default: true },
//         address: { type: String },
//         selectedMode: { type: String },
//         newsletter: { type: Boolean, default: false },
//         couponUsage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiscountCoupon' }],
//         role: { type: String, enum: ['admin', 'user', 'staff'], default: 'user' },
//     }, { timestamps: true });

// // Product Model
// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String },
//     price: { type: Number, required: true },
//     imageUrl: [{ type: String }],
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//     createdAt: { type: Date, default: Date.now },
// });

// // Category Model
// const categorySchema = new mongoose.Schema({
//     name: { type: String, required: true, unique: true },
//     description: { type: String },
//     createdAt: { type: Date, default: Date.now },
// });

// // Store Model
// const storeSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     address: { type: String, required: true },
//     phone: { type: String, required: true },
//     staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     coordinates: {
//         type: String,  // This stores the full Google Maps link
//         required: false
//     },
// });

// // Package Model
// const packageSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String },
//     minutes: { type: Number, required: true },
//     price: { type: Number, required: true },
//     imageUrl: [{ type: String }],
//     createdAt: { type: Date, default: Date.now },
// });

// // Discount Coupon Model
// const discountCouponSchema = new mongoose.Schema({
//     couponCode: { type: String, required: true, unique: true },
//     percentage: { type: Number, required: true },
//     maxUsage: { type: Number, required: true },
//     expiry: { type: Date, required: true },
// });

// // Order Model
// const orderSchema = new mongoose.Schema({
//     userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     productRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//     packageRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
//     totalAmount: { type: Number, required: true },
//     status: { type: String, required: true },
//     detailsFromStripe: { type: Object },
//     paymentMethod: { type: String },
// }, { timestamps: true });

// // Newsletter Model
// const newsletterSchema = new mongoose.Schema({
//     userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     subscribedAt: { type: Date, default: Date.now },
//     email: { type: String, required: true },
//     phone: { type: String },
// });

// // Cart Model
// const cartSchema = new mongoose.Schema({
//     userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

//     items : [{type: mongoose.Schema.Types.ObjectId}],
//     // cartTotal: { type: Number, required: true, default: 0 },
// }, { timestamps: true });

// // Booking Model
// const bookingSchema = new mongoose.Schema({
//     userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     storeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
//     date: { type: Date, required: true },
//     timeSlots: [
//         {
//             startTime: { type: String, required: true },
//             endTime: { type: String, required: true },
//         },
//     ], // Array of time slots (each with startTime and endTime)
//     packageRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
// });

// // Unavailable Slots Model
// const unavailableSlotSchema = new mongoose.Schema({
//     storeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
//     date: { type: Date, required: true },
//     slots: [
//         {
//             startTime: { type: String, required: true },
//             endTime: { type: String, required: true },
//             reason: { type: String },
//         },
//     ], // Array of slots (each with start and end time)
// });

// // Unavailable Days Model
// const unavailableDaySchema = new mongoose.Schema({
//     storeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
//     dates: { type: [Date], required: true }, // Array of dates (multiple unavailable days)
//     reason: { type: String },
// });

// // Models Export
// export const userTable = mongoose.models?.User || mongoose.model('User', userSchema);
// export const productTable = mongoose.models?.Product || mongoose.model('Product', productSchema);
// export const categoryTable = mongoose.models?.Category || mongoose.model('Category', categorySchema);
// export const storeTable = mongoose.models?.Store || mongoose.model('Store', storeSchema);
// export const packageTable = mongoose.models?.Package || mongoose.model('Package', packageSchema);
// export const discountCouponTable = mongoose.models?.DiscountCoupon || mongoose.model('DiscountCoupon', discountCouponSchema);
// export const orderTable = mongoose.models?.Order || mongoose.model('Order', orderSchema);
// export const newsletterTable = mongoose.models?.Newsletter || mongoose.model('Newsletter', newsletterSchema);
// export const cartTable = mongoose.models?.Cart || mongoose.model('Cart', cartSchema);
// export const bookingTable = mongoose.models?.Booking || mongoose.model('Booking', bookingSchema);
// export const unavailableSlotTable = mongoose.models?.UnavailableSlot || mongoose.model('UnavailableSlot', unavailableSlotSchema);
// export const unavailableDayTable = mongoose.models?.UnavailableDay || mongoose.model('UnavailableDay', unavailableDaySchema);

// // Initialize connection (call this function somewhere in your app before using the models)
// // connectToDatabase();
