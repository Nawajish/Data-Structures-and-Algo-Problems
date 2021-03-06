// Given a non-empty array containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

// Note:

// Each of the array element will not exceed 100.
// The array size will not exceed 200.

// O(2^n)
var canPartition = A => {
    let totalSum = nums.reduce((acc, curr) => acc + curr);
    if (totalSum % 2) return false;

    const target = totalSum / 2;
    const memo = new Set([0]);

    for (let number of A) {
        let possibleSums = Array.from(memo);
        for (let possibleSum of possibleSums) {
            memo.add(possibleSum + number);
        }
    }
    return memo.has(target);
};



//clear backtracking, TLE
var canPartition = (candidates) => {
    
    //sumA
    let target=candidates.reduce((acc, curr) => acc + curr)
    if (target%2) return false; //As we said our sum has to be dividible by two
    target/=2

    
    const backtracking = (currSum, index) => {
        //if our Sum is bigger than my target there's no reason to continue expanding
        if (currSum > target || index>=candidates.length)return false
        // when I reach my target, return true
        if (currSum === target)return true

        return backtracking(currSum + candidates[index],index+1)||backtracking(currSum,index+1)

    }
  
    return backtracking(0,0)
  } 

  //get's TLE'd on 
  //[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100]

//  clear backtracking top bottom TLE
var canPartition = (candidates) => {
    let target=candidates.reduce((acc, curr) => acc + curr)
    if (target%2) return false;
    target/=2

    
    const backtracking = (remaining, index) => {
        if (remaining <0  || index<0)return false
        if (remaining === 0)return true

        return backtracking(remaining-candidates[index],index-1)||backtracking(remaining,index-1)

    }
  
    return backtracking(target,candidates.length-1)

  } 

  //backtracking works fast
  var canPartition=candidates=>{
  
    candidates.sort((a, b) => b- a); //key for TLE :Essentially means: If you fail,do it fast
    let target=candidates.reduce((acc, curr) => acc + curr)
    if (target%2) return false;
    target/=2

    
    const backtracking = (remaining, index) => {
        if (remaining <candidates[index]  || index>=candidates.length)return false
        if (remaining === candidates[index])return true

        return backtracking(remaining-candidates[index],index+1)||backtracking(remaining,index+1)

    }
  
    return backtracking(target,0)
}


//  K   N   A   P   S   A   C   K       S   O   L   U   T   I   O   N
// Let us see what we seek: Whether (boolean) there is a pair of partition subsets
// A1,A2, such that sum(A1)=sum(A2)
//  now let's advance what we seek to a clearer formula
//  I know that sumA1 + sumA2= sumA
//  so 2*sumA1=sumA since sumA1=sumA2
//  so sumA1=sumA/2
// that means I seek a subset of my current set so that it equals the sum of all my elements divided by two,
// From that I can deduce that the sum of all my elements must be divisible by two
// so It must be even, or there is no such subset

// Ok so this is apparently another knapsack problem which DP can handle.
// I will create a matrix of N rows (for each Item I can potentially use)
// and M columns (all the possible results of the sum of my item selection)

// The dp relies on the intuition that: On my final selecion, I can Either choose an Item, or Ignore it, hence each cell of my dp matrix will represent
// dp[i][j] : The total number of ways sum J can be reached using the first i items
// dp[i][j]=dp[i-1][j]+dp[i-1][j-A[i-1]]
// that means: the Number of ways i can reach sum J with the first i items is the sum of:
// the number of ways I can reach the same sum with the previous i-1 elements (which basically means I didnt choose the i-th item)
// plus
// the number of ways I can reach the same sum minus the sum of the i-1th item , which means that I chose the last item in order to get to my sum J

// Runtime O(N*sum(A))
// Space O(N*sum(A))=> can be reduced by just alternating between just two rows, because my formula only relies on just the previous row
var canPartition = function(A) {
    //calculate the sum of my Array
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;

    //create Rows
    // i want a row for each of my candidate elements+ one for my
    // 0th element( no element ) which I know for a fact can add up to 0 if selected
    var dp = new Array(A.length + 1).fill(null);

    // create Columns
    // My final total sum ranges from 0 to sumA, which are totally sumA+1 candidates
    dp = dp.map(d => Array(sumA + 1).fill(0));

    // now that the matrix is created i have to use my base case which is:
    // The number of ways I can end up with sum=0 by using 0 items is 1 ways: just by selecting the 0th item (doesnt exist, which means i just take no item at all)
    dp[0][0] = 1;

    //now let's see what I actaully want to find
    //if there is ANY subset, that adds Up to sumA/2
    //so that would mean ANY element of the column A/2, that would be dp[;][A/2]

    //now, theoretically, I could fill the whole board and then check my column but that's BOOOOOOOOOOORING
    // so let's look at my formula again
    // dp[i][j]=dp[i-1][j]+dp[i-1][j-A[i-1]]
    // so that means, any element will eithter use the item above it( on the previous row or same column), or an item on the previous row but on a smaller number of column
    // so It's ok not to fill the whole board and just go up to my desired column (A/2)

    //here i=0 cos everything other column (sum) of this row cannot be created with 0 elements
    for (let i = 1; i < A.length; i++) {
        for (let j = 0; j <= sumA / 2; j++) {
            //I know that i-1>=0 so i dont need an extra check for that
            dp[i][j] += dp[i - 1][j];
            if (j - A[i - 1] >= 0) dp[i][j] += dp[i - 1][j - A[i - 1]];

            // here i check whether the element of the row I'm concerned about was positive, if so that means a target Subset was found
            if (j == sumA / 2 && dp[i][j]) return true;
        }
    }
    console.log(dp.forEach(d => console.log(d + '')));
    return false;
};


var canPartition = function(A) {
    //calculate the sum of my Array
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;

    //create Rows
    // i want a row for each of my candidate elements+ one for my
    // 0th element( no element ) which I know for a fact can add up to 0 if selected
    var dp = new Array(A.length + 1).fill(null);

    // create Columns
    // My final total sum ranges from 0 to sumA, which are totally sumA+1 candidate weights(sums)
    dp = dp.map(d => Array(sumA/2).fill(false));

    // now that the matrix is created i have to use my base case which is:
    // If there is a way for me to get sum=0, with 0 elements
    dp[0][0] = true;    // of course there is


    //now let's see what I actaully want to find
    //if there is ANY subset, that adds Up to sumA/2
    //so that would mean ANY element of the column A/2, that would be dp[;][A/2]


    //here i=0 cos everything other column (sum) of this row cannot be created with 0 elements
    for (let i = 1; i < A.length; i++) {
        for (let j = 0; j <= sumA / 2; j++) {
            //I know that i-1>=0 so i dont need an extra check for that
            if (j - A[i - 1] >= 0){
                dp[i][j] = dp[i - 1][j - A[i - 1]]||dp[i - 1][j];
            }
            else{
                dp[i][j] = dp[i - 1][j];

            }
            
        }
    }
    return dp[A.length-1][sumA/2];
};

// ok let's optimize this a bit by just creating 2 rows of length sumA/2 +1
// which should be sufficient to reduce memory constraints
var canPartition = function(A) {
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;

    var previous = new Array(sumA / 2 + 1).fill(0);

    //var current = new Array(sumA / 2 + 1).fill(0);
    //or if youre kewl
    var current = [...previous]; // copies the array, same as
    // var current=Array.from(previous) //l8am8a
    previous[0] = 1;

    for (let i = 1; i < A.length; i++) {
        //OLD WAY ,with hard copying the previous array
        for (let j = 0; j <= sumA / 2; j++) {
            current[j] = 0;
            //I know that i-1>=0 so i dont need an extra chec   k for that
            current[j] += previous[j];
            if (j - A[i - 1] >= 0) current[j] += previous[j - A[i - 1]];

            if (j == sumA / 2 && current[j]) return true;
        }
        //that's O(sumA/2+1) complexity
        //copy the array (choose one of them)
        previous = current.slice(0); // seems to be faster than spread operator
        //  previous=Object.values(current)
        //   previous=current.map(d=>d)
        // previous=JSON.parse(JSON.stringify(current))
        //previous=Array.from(current)
    }

    return false;
};

// optimization one row
var canPartition = function(A) {
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;

    var previous = new Array(sumA / 2 + 1).fill(0);

    //with the new way I end up not needing as second array (LOOK further down)
    //var current = new Array(sumA / 2 + 1).fill(0);
    //or if youre kewl
    // var current=[...previous] // copies the array, same as
    // var current=Array.from(previous) //l8am8a
    previous[0] = 1;

    for (let i = 1; i < A.length; i++) {
        console.log(A[i - 1]);
        console.log(previous + '');

        //OLD WAY ,with hard copying the previous array
        // for (let j = 0; j <= sumA / 2; j++) {
        //     current[j] = 0;
        //     //I know that i-1>=0 so i dont need an extra chec   k for that
        //     current[j] += previous[j];
        //     if (j - A[i - 1] >= 0) current[j] += previous[j - A[i - 1]];

        //     if (j == sumA / 2 && current[j]) return true;
        // }
        //that's O(sumA/2+1) complexity
        //copy the array (choose one of them)
        // previous = current.slice(0); // seems to be faster than spread operator
        //  previous=Object.values(current)
        //   previous=current.map(d=>d)
        // previous=JSON.parse(JSON.stringify(current))
        // previous=Array.from(current)

        // New way, better runtime and space cos i m not hard copying the array
        //ok it's actually big brain time, what if I only use just one array and traverse it from right to left HUUUUUUUUH? what if I just use previous and just update it leftwards in order for me to not alter the important columns
        for (let j = sumA / 2; j >= 0; j--) {
            previous[j] += j - A[i - 1] >= 0 ? previous[j - A[i - 1]] : 0;

            if (j == sumA / 2 && previous[j]) {
                console.log(A[i]);
                console.log(previous + '');
                return true;
            }
        }
        // inb4 it actually works and its better(O(sumA+1)) space
    }
    console.log(previous + '');

    return false;
};

// optimization using bits and 2 states
var canPartition = function(A) {
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;
    // to start with, i want the number with 1 as its first element so i can mimic the previous[0]=1 state, and length of bits= the length of bits of my desired sum (sumA/2)
    let row = 1n << BigInt(sumA / 2 ); //using bigint cos my sum may consist of more than 32bits

    for (const weight of A) {
        row = row | (row >> BigInt(weight));
      
    }
    // check the the column corresponding to the sum by bitwise ANDing it with just 1,so if the first bit is 1, it will return true, otherwise false
    return row&1n;
};

// Best optimized way using BITS
// now essentially this is a mirrored version of the knapsack table
// not to worry, it's not that difficult to understand
var canPartition = function(nums) {
    //start the accumulator as a BigInt(1)
    // because the total sum can be bigger than 32 (but the standard numbers are 32-bit integer, so if i am to calculate higher shizzle u better turn tahat shit to BigInt)
    // and keep leftshifting and |-ing every weight
    let bits = nums.reduce((acc, num) => acc | (acc << BigInt(num)), 1n);
    // sum the array
    let acc = nums.reduce((acc, num) => acc + num);

    // if acc&1=1 that means that acc's last bit was 1, so acc was odd. As we said earlier we dont want it to be odd, so that has to acc&1 must be 0 (false)
    // now, the bloke is left shifting
    if (acc & 1) return false;
    // acc is definitely even now
    // so acc/2 == acc>>1
    acc = BigInt(acc / 2);

    return Boolean((bits >> acc) & 1n);
};
//


//knapsacks with booleans
var canPartition = function(A) {
    //calculate the sum of my Array
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;

    //create Rows
    // i want a row for each of my candidate elements+ one for my
    // 0th element( no element ) which I know for a fact can add up to 0 if selected
    var B = new Array(A.length + 1).fill(null);

    // create Columns
    // My final total sum ranges from 0 to sumA, which are totally sumA+1 candidate weights(sums)
    B = B.map(d => Array((sumA/2)+1).fill(false));

    // now that the matrix is created i have to use my base case which is:
    // If there is a way for me to get sum=0, with 0 elements
    B[0][0] = true;    // of course there is


    //now let's see what I actaully want to find
    //if there is ANY subset, that adds Up to sumA/2
    //so that would mean ANY element of the column A/2, that would be dp[;][A/2]


    //here i=0 cos everything other column (sum) of this row cannot be created with 0 elements
    for (let i = 1; i <= A.length; i++) {
        for (let j = 0; j <= sumA / 2 ; j++) {
            //I know that i-1>=0 so i dont need an extra check for that
            if (j - A[i - 1] >= 0){
                B[i][j] = B[i - 1][j - A[i - 1]]||B[i - 1][j];
            }
            else{
                B[i][j] = B[i - 1][j];

            }
            
        }
    }

    return B[A.length][sumA/2];
};


var canPartition = function(A) {
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;
  
    var previousRow = new Array((sumA/2)+1).fill(false);
    var currentRow= new Array((sumA/2)+1).fill(false);
    
    previousRow[0] = true; // base case  


    for (let i = 1; i <= A.length; i++) {
        for (let j = 0; j <= sumA / 2 ; j++) {
           
            if (j - A[i - 1] >= 0){
                currentRow[j] = previousRow[j - A[i - 1]]||previousRow[j];
            }
            else{
                currentRow[j] = previousRow[j];

            }
            
        }
        previousRow=currentRow.slice(0) // make previous=current
    }

    return currentRow[sumA/2];
};

var canPartition = function(A) {
    var sumA = A.reduce((acc, curr) => acc + curr);

    if (sumA % 2) return false;
  
    var row = new Array((sumA/2)+1).fill(false);
    
    row[0] = true; // base case  


    for (let i = 1; i <= A.length; i++) {
        for (let j = sumA / 2; j >= 0; j--) {
            if (j - A[i - 1] >= 0){
                row[j] = row[j - A[i - 1]]||row[j];
            }
        }
    }

    return row[sumA/2];
};





console.log(
    DDcanPartition(
        [23,13,11,7,6,5,5]
        // [1,1]
        //[1, 2, 5]
    )
);





/// QUESTION, OPTIMIZE THE FAIL FAST 
var canPartition=candidates=>{

    let target=candidates.reduce((acc, curr) => acc + curr)
    if (target%2) return false;
    target/=2

    let freq={}
    candidates.forEach((d,i)=>{
        freq[d]=(freq[d]||0)+1
    })
    
    candidates=[]
    for (const key in freq) {
        if(freq[key]===1)candidates.push(Number(key))
        else{
            for (let i = 0, value=Number(key); i < freq[key]; i++,value+=Number(key)) {
                candidates.push(value)
            }
        }
    }

    candidates.sort((a, b) =>b-a); //key for TLE :Essentially means: If you fail,do it fast
    console.log(candidates)
   

    
 

    
    const backtracking = (remaining, index) => {
        if ( index>=candidates.length)return false
        if (remaining <0)return false
        if (remaining===candidates[index])return true

        return backtracking(remaining-candidates[index],index+1)||backtracking(remaining,index+1)

    }
  
    return backtracking(target,0)
}

// console.log(
//     canPartition(
//         [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100]    )
// )


// console.log(
//     canPartition(
//         [6,4,4,3,1,]
//     )
// )

console.log(
    canPartition(
        [2,2,3,5]
    )
)