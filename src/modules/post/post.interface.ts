import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface ICreatePostPayload{
title:string,
content:string,
thumbnail?:string,
isFeatured?:boolean,
status:PostStatus,
tags:string[]
}

export interface IUpdatePostPayload{
    title?:string,
content?:string,
thumbnail?:string,
isFeatured?:boolean,
status?:PostStatus,
tags?:string[]
}


export interface IPostQuery extends PostWhereInput{
  //post model field
  title?:string
  content?:string

  searchTerm?:string
  page?:string
  limit?:string
  SortOrder?:string
  sortBy?:string
}