interface UserType {
    _id: string,
    firstName: string,
    lastName: string,
    user: string,
    name: string,
    rating: number,
    comment: string,
    createdAt: string,
    updatedAt: string,
}

export type ProductType = {
  _id?: string,
  // user: Pick<UserType, '_id' | 'firstName' | 'lastName' >,
  user?: Partial<UserType>,
  name: string,
  image: string,
  imageString?:any,
  brand: string,
  category: string,
  description: string,
  reviews?: Partial<UserType>[],
  rating: number,
  numReviews: number,
  price: number,
  countInStock: number,
  createAt?: string,
  updatedAt?: string
}