// We have two integer sequences A and B of the same non-zero length.

// We are allowed to swap elements A[i] and B[i].  Note that both elements are in the same index position in their respective sequences.

// At the end of some number of swaps, A and B are both strictly increasing.  (A sequence is strictly increasing if and only if A[0] < A[1] < A[2] < ... < A[A.length - 1].)

// Given A and B, return the minimum number of swaps to make both sequences strictly increasing.  It is guaranteed that the given input always makes it possible.




var minSwap = function(A, B) {

    let result=Infinity // early termination mechanism +20tests not TLE

    let dfs=(i,prevchanged,totalswitched)=>{
        if(totalswitched>=result)return Infinity
        if(i===A.length){
            result=Math.min(totalswitched,result)
            return totalswitched
        }
        if(A[i]===B[i])return dfs(i+1,false,totalswitched)

        if(prevchanged){
            if(A[i]<=B[i-1]||B[i]<=A[i-1])return dfs(i+1,true,totalswitched+1)
            if(A[i]<=A[i-1]||B[i]<=B[i-1])return dfs(i+1,false,totalswitched)
        }
        else{
            if(A[i]<=A[i-1]||B[i]<=B[i-1])return dfs(i+1,true,totalswitched+1)
            if(A[i]<=B[i-1]||B[i]<=A[i-1])return dfs(i+1,false,totalswitched)
        }
        return Math.min(dfs(i+1,false,totalswitched),dfs(i+1,true,totalswitched+1))
    }


    return Math.min(dfs(0,0,0),dfs(0,1,1))
};


// O(n),O(n)
var minSwap = function(A, B) {

    
    let dp=Array(2).fill(null).map(d=>Array(A.length).fill(Infinity))
    dp[0][0]=0
    dp[1][0]=1
    

    for (let j = 1; j < A.length; j++) {

            if(A[j]<=A[j-1]||B[j]<=B[j-1]){
                dp[0][j]=dp[1][j-1]
                dp[1][j]=dp[0][j-1]+1
                continue
            }
            if(B[j]<=A[j-1]||A[j]<=B[j-1]){
                dp[0][j]=dp[0][j-1]
                dp[1][j]=dp[1][j-1]+1
                continue
            }

            if(A[j]===B[j]){
                dp[0][j]=dp[0][j-1]
                dp[1][j]=dp[1][j-1]
                continue
            }

            dp[0][j]=Math.min(dp[0][j-1],dp[1][j-1])
            dp[1][j]=Math.min(dp[0][j-1],dp[1][j-1])+1
        
    }

    return Math.min(dp[0][A.length-1],dp[1][A.length-1])
};

//O(n) O(1)
var minSwap = function(A, B) {

    
    let nochange=0
    let change=1
    

    for (let j = 1; j < A.length; j++) {
            if(A[j]===B[j])continue

            if(A[j]<=A[j-1]||B[j]<=B[j-1]){
              [nochange,change]=[change,nochange+1]
                continue
            }
            if(B[j]<=A[j-1]||A[j]<=B[j-1]){
                [nochange,change]=[nochange,change+1]
                continue
            }

            let min=Math.min(change,nochange)
            nochange=min
            change=min+1
        
    }

    return Math.min(nochange,change)
};

console.log(
    minSwap(
        [0,4,4,5,9],
        [0,1,6,8,10]
    )
)