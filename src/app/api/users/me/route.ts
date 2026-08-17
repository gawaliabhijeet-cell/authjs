import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";
connect()


export async function POST(request:NextRequest) {
    // extract data form token

  const userID =  await getDataFromToken(request)
  const user = await User.findOne({_id:userID}).select("-password")

  // check is there is no user
  return NextResponse.json({
    message: "user found",
    data: user
  })
}