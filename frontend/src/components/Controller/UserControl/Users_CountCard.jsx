import React, { useEffect, useState } from "react";

export const CountCard = (title, description,accessLevel, users) => {

    const [userCount, setUserCount] = useState('');

    useEffect(() => {
        if(users){
            if(accessLevel == 1){
                const adminCount = users[1].count;
                setUserCount(adminCount);
            } else {
                const normalCount = users[3].count + users[2].count;
                setUserCount(normalCount);
            }
            console.log("GetCount:", users);
        }
    },[users]);

    useEffect(() => {
        if(userCount) console.log("user count",userCount);
    },[userCount])

    return(
        <div className="flex flex-col items-center justify-around border rounded-lg bg-white w-[370px] md:h-[180px] lg:h-[200px] shadow">
            <div className="flex items-center py-2">
                <div className="md:w-[90px] md:h-[90px] lg:w-[105px] lg:h-[105px] border-[10px] border-mapRed font-mono rounded-full justify-center font-bold text-[50px] text-center">{userCount}</div>
            </div>
            <div className="flex flex-col space-around rounded-b-lg items-center w-full h-full bg-mapGreen">
                <div className="text-[14px]">{description}</div>
                <div className="md:text-[30px] lg:text-[36px]">{title}</div>
            </div>
        </div>
    )
}