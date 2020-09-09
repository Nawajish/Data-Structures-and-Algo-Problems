// The latest version of your favorite adventure game has just been released. On each level you search for stars that earn you points. Simply moving over a location containing stars allows you to acquire them. To help you on your journey, you are given an overhead map of the level in a String[]. Each character in level describes the number of stars at that location. You begin in the upper left spot of the map (character 0 of element 0 of level). On the current stage you must move according to the following rules:
// 1) On the first pass you may only move downward or rightward each move (not diagonally) until you reach the lower right corner.
// 2) The second pass begins in the lower right corner where the first pass ended, and proceeds back to the beginning using only upward and leftward steps (not diagonal).
// 3) The final pass, like the first pass, begins in the upper left corner and proceeds to the lower right corner using only rightward and downward (not diagonal) steps.
// Once the stars on a spot are claimed, they cannot be claimed again on a future pass. Return the largest possible number of stars that can be acquired.
 
// Definition
    	
// Class:	StarAdventure
// Method:	mostStars
// Parameters:	String[]
// Returns:	int
// Method signature:	int mostStars(String[] level)
// (be sure your method is public)
    
 
// Constraints
// -	level will contain between 2 and 50 elements inclusive.
// -	Each element of level will contain between 2 and 50 characters inclusive.
// -	Each element of level will contain the same number of characters.
// -	Each character in each element of level will be a digit ('0' - '9').
// -	Character 0 in element 0 of level will be '0'.
 
// Examples
// 0)	
    	
// ["01",
//  "11"]
// Returns: 3
// 1)	
    	
// ["0999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"
// ,"9999999999"]
// Returns: 450
// 2)	
    	
// ["012"
// ,"012"
// ,"012"
// ,"012"
// ,"012"
// ,"012"
// ,"012"]
// Returns: 21
// 3)	
    	
// ["0123456789",
//  "1123456789",
//  "2223456789",
//  "3333456789",
//  "4444456789",
//  "5555556789",
//  "6666666789",
//  "7777777789",
//  "8888888889",
//  "9999999999"]
// Returns: 335

//essentially perform dp 3 times, each time setting the coins u take to 0
// and choose the best 3 paths. 
// WHICH OF COURSE TURNS OUT TO BE WRONG. cos the 3 best paths dont yield me the best sum
var stars=(A)=>{
    let n=A.length,m=A[0].length,result=0
    for (let i = 0; i < n; i++) 
        A[i]=A[i].split('').map(d=>Number(d))        
    
    for (let k = 0; k < 3; k++) {
        let dp=[...Array(n)].map(d=>[...Array(m)].map(d=>0))
        //dp[i][j] max coins from start till idx i j 
        //basecase dp[0][0] start from 0
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if(i>=1)dp[i][j]=Math.max(dp[i-1][j],dp[i][j])
                if(j>=1)dp[i][j]=Math.max(dp[i][j-1],dp[i][j])
                dp[i][j]+=A[i][j]
            }        
        }
        result+=dp[n-1][m-1]
        let recursion=(i,j)=>{
            if(i==0&&j==0||(i<0||j<0))return
            if(i!==0&&(j==0||dp[i][j]-A[i][j]==dp[i-1][j]))
                recursion(i-1,j)
            else if(i==0||dp[i][j]-A[i][j]==dp[i][j-1])
                recursion(i,j-1)
            A[i][j]=0
        }
        recursion(n-1,m-1)
    }
    return result
}


//ok so this is the firest dp Problem, whose solution is 3D while the input is 2d. 


//Here's the mistake. In order to get the best sum, my paths must not intersect.
// If they intersect,that means I'm revisiting a cell which now has value 0. 

// So, apparently the thing here is that we have to construct the paths simultaneously.
// We need to notice that at any given state , the three paths MADE THE SAME NUMBER OF MOVES FROM THE TOP LEFT NODE ( THE BEGINNING ). (because u can move either down or right) so their relative position can be tracked using 4 variables.
// (x1,x2,x3, y1) indicates that the current position of each path is :
// (x1,y1), (x2,x1+y1-x2), (x3, x1+y1-x3) with x1<x2<x3

// so the potential next moves are: 
// (x1+1,x2+1,x3+1,y1) (RRR)
// (x1,x2+1,x3,y1+1) (DRD)
// (x1,x2,x3+1,y1+1) (DDR)
// ... 2**3=8 total permutations


//let's try to do it with 2 paths first instead. 
// let max[x1][x2][y1] be the max cost that can be achieved at this state
// i can get to this state with 4 potential previous states
// max[x1-1][x2][y1] (Boi1 came from left, Boi2 came from top)
// max[x1-1][x2-1][y1] (Boi1 came from left, Boi2 came from left)
// max[x1][x2][y1-1] (Boi1 came from top, Boi2 came from top)
// max[x1][x2-1][y1-1] (Boi1 came from top, Boi2 came from left)
let twoPaths=A=>{
    let n=A.length,m=A[0].length,result=0,
        // m*m*n (x1,x2,y1)
        max=[...Array(m)].map(d=>[...Array(m)].map(d=>[...Array(n)].map(d=>0)))
    //basecases
    //x1=0,y1=0

    for (let y1 = 0; y1 <n; y1++) {
        for (let x1 = 0; x1 < m; x1++) {
            for (let x2 = x1; x2 < m; x2++) {
                max[x1][x2][y1]=Math.max(
                    x1>=1?max[x1-1][x2][y1]:0,
                    x1>=1&&x2>=1?max[x1-1][x2-1][y1]:0,
                    y1>=1?max[x1][x2][y1-1]:0,
                    x2>=1&&y1>=1?max[x1][x2-1][y1-1]:0
                )+  
                    A[y1][x1]
                 +
                    //if (x1==x2) then we re talkin about the same cell
                    // so it should only be added once to the result 
                    (( x1==x2||x1+y1<x2)?0:A[x1+y1-x2][x2] )

                   
            }            
        }        
    }
    return max[m-1][m-1][n-1]
}

// a similar problem would be the following from GEEKS4GEEKS
// Collect maximum points in a grid using two traversals
// with a minor tweak. 


[   
    
[[25, 16, 25 ],
[12, 18, 19], //136
[11 ,13 ,8]],
    [[0,2,3],
     [4,5,6],//32
     [7,8,0]
        ],
[ [ 1, 0, 3, -1 ], 
[ 3, 5, 1, -2 ],  //16
[ -2, 0, 1, 1 ], 
[ 2, 1, -1, 1 ] ], 
    [
        [0,2,1],
        [1,0,0], //6
        [0,2,0]
        ],
[
    [98, 89 ,26, 80 ,53, 70, 44, 10 ,9 ,91],
[35, 71, 46 ,99, 84 ,14, 90, 86, 3 ,16],
[50, 61 ,16 ,12 ,77, 84 ,86, 80, 41, 56],
[13, 40 ,3 ,6, 98, 69 ,37, 45 ,42, 72],
[5, 86 ,36 ,97 ,1 ,85 ,23 ,1 ,76 ,35],
[94 ,72 ,74, 17, 33, 52, 48, 5, 33, 19],    //2367
[17, 1, 17, 79 ,46 ,22 ,87, 34 ,94 ,92],
[60 ,70 ,59 ,3, 78 ,16, 50, 62, 5, 57],
[69 ,23 ,99, 93, 26 ,61, 67 ,53, 86 ,58],
[75, 73, 96, 31, 55, 39, 21, 20 ,22 ,18]
],[
 [   11, 14, 25, 9 ,52 ,22 ,42],
[25, 22, 39, 2 ,30 ,44 ,69],
[67, 7 ,45 ,14 ,44 ,11 ,69],
[45 ,40 ,17 ,29 ,32 ,33 ,17],           //922
[43, 11, 23, 7 ,47 ,45 ,22],
[9 ,54 ,13 ,66 ,25 ,46 ,57],
[0, 6, 43, 58, 47, 6 ,68]
]
].forEach(d=>console.log(twoPaths(d)))
console.log('3 paths now')

//ok let's modify our previous algo for 3 paths
var stars=(A)=>{
    let n=A.length,m=A[0].length,result=0
    for (let i = 0; i < n; i++) 
        A[i]=A[i].split('').map(d=>Number(d))        
    // m*m*m*n (x1,x2,x3,y1)
    max=[...Array(m)].map(d=>[...Array(m)].map(d=>[...Array(m)].map(d=>[...Array(m)].map(d=>0))))

    for (let y1 = 0; y1 <n; y1++) {
        for (let x1 = 0; x1 < m; x1++) {
            for (let x2 = x1; x2 < m; x2++) {
                for (let x3 = x2; x3 < m; x3++) {
                    
                max[x1][x2][x3][y1]=Math.max(   
                    x1>=1?max[x1-1][x2][x3][y1]:0,
                    x1>=1&&x3>=1?max[x1-1][x2][x3-1][y1]:0,
                    x1>=1&&x2>=1?max[x1-1][x2-1][x3][y1]:0,
                    x1>=1&&x2>=1&&x3>=1?max[x1-1][x2-1][x3-1][y1]:0,
                    y1>=1?max[x1][x2][x3][y1-1]:0,
                    y1>=1&&x3>=1?max[x1][x2][x3-1][y1-1]:0,
                    x2>=1&&y1>=1?max[x1][x2-1][x3][y1-1]:0,
                    x2>=1&&y1>=1&&x3>=1?max[x1][x2-1][x3-1][y1-1]:0
                )+  
                    A[y1][x1]
                 +
                    (( x1==x2||x1+y1<x2)?0:A[x1+y1-x2][x2] )
                 +
                    ((x1==x3||x2==x3||x1+y1<x3)?0:A[x1+y1-x3][x3])
                } 
            }            
        }        
    }
    return max[m-1][m-1][m-1][n-1]
}

let results=[
    270,
    264,
    1888,
    1875,
    2583,
    140,
    556,
    1935,
    317,
    270,
    1898
]
let z=[
    ["0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999"],
    ["0288810535", "1451646436", "1978113075", "3544091837", "7139597729", "2498397171", "2522264811", "0419172300", "5928956012", "6820155835"],
    ["02993304197380443540911403782242516839957219937502", "30155763432558065304435199193052514963515262138625", "06547394233552540328999963249082497849428457441443", "84753377171153427729578399193160784227128085775650", "86482552314367698135085465295552273064435285577009", "14463453583360892579238174629374258858132905349449", "63094491532958938640709990572646196516690336413382", "05384771035459962283269273444062963297880287852546", "11090096873765145762439095457229472560643344453428", "73137644969260653198504296936425176750039795705464", "28776604339983015203565560374788950706776935197098", "81751665531443302463124898949569614285603639574734", "14367883199599494246010265935943441701479451732088", "52367172393639849495865082767277009642091761772039", "78862230787246625554265021855281495455506194166144", "54216588266015650006474490565492623963196632063730", "10429071549959299012955140914616955922080109229506", "58186583395744879330421354016014213019426445122436", "08053743607759991138853723688018732576308291968421", "15565223913236859405062635941547490784686129478960", "75686803051800210442192388380210676290958457438939", "71613872089913841494296095050204198698233153878673", "13260240364717334675492534732617576579532668042555", "26888924126446257395786009273112473916416277877138", "06196774686978922406555085652816734700740947511023", "03782129418146502825652725912180872723597377146423", "62781988797914811434323207364991466953514329810902", "42936329604747139979899053997807920495587500152701", "30592392617531361243812860422047531054231371692738", "33959647918522469391366899675536882100884439640927", "57417539944622190891460353156940278094305699270897", "99231811448566750949587044996165554200430401665706", "56140776644703735410180972014267511526815226836092", "30639932495739641238123893123054927569492238235123", "81849122952164646756641209588710892078147392695952", "34546592730750446062069068525092660420695728981878", "99338908708714908503049803214453767542691830191221", "42391658452492629099998063789715391276753635941970", "08893368911246659541989689162918242052766573038214", "27057701893024293712093637592905761722264398757088", "79593569253262258649106339118856138207743252699020", "99992416996233366060385941396764599650015169553234", "13578319783539173904443487631449994649698031138656", "62675746937503864492137248221691966930101802751169", "38391625413521082378128080729023210563388821823424", "20385395709456133930077004548358808068687595395159", "36554427610841450325452429328147515594563969426437", "80992195056875194137095699095466333955645508249431", "71547061833971433185923671159227943986800443512644", "30331499911108579401470124206753254016435522527451"],
    ["01949339977612514230186569004575786432327834948847", "28695773030102655429618802607873489538592364457433", "16585769065254647217714268399120707035718944076817", "65759607069400716764053694145508475567911439566080", "89862366417633704430628986357651354189096630959761", "27347526973041572558966137105055303898535857023438", "82602329516253149710612474779445456398498710042560", "88309311938941489029027187710930150092302589434479", "59028736876589150872703773524725276000195785873487", "11556179023820570562079465220295995576745071998981", "25533612465642996134509596242851379514184035554709", "27741780384680113569204176502887033572800238011781", "19513773970804488539242497998726323607257249823404", "37976208254517767530855317119914072819944926179670", "81966984540276989117798191344415373292224849641895", "81188040423391044699716650992042742082739988073814", "48790056724713023391783347723311485630845177164183", "69560138800191433409457923537244091403136717527671", "71190049822903480858105354487603896179988352041997", "51265313275095205187738240657673704612735246370242", "37799077921049051952751477508141238970678157179640", "26588119760064974204850188872846419267823260205033", "12992524109269970910320458368967061292023619453280", "81475056543123240647031034910819293460315943132649", "36243541106240545096779695212053610990900514845933", "66075935789462028082714327165013185140707743243338", "99989037166699696902626917673434144838596367134987", "58200675648912952894228524007603448351485693746614", "24890197914928425357039827131606134887509065995435", "92298026850987391848157085079516712059743533961853", "85907184555326707452438264621705532573534102357772", "66455555094921836712637428821442339796524620701313", "35237589010811971536470358711184265443764640867484", "77239839483546290254575874713362129539144551476932", "64738803214391578762154021175819899988905763836449", "63277056428134310001829314340709993602899901592242", "85845696998063434043202645973952164768777129137318", "26253025378801315853776494987178661862749756657506", "22784669971512379515531190751854750005044887253729", "15603896893578213611236477523291625188516862086462", "13633775768848632873078582708433072130943017583601", "06259549424218984594043395673248697045254313639641", "27724764294205904927874164151190485626955423698277", "17817819118002143898909240409451727034923613160386", "22705261267933828678040141385416002310885329213335", "43739111120088444887225044013587434999053519525948", "18077158376842797646517562900803821925813728746411", "86901932666007975528663937312603147744877786611620", "22791030152707840537091937169501612419357565970164", "21879382726521010581540306264798781042419116775032"],
    ["09999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999", "99999999999999999999999999999999999999999999999999"],
    [
     "0999900",
     "9000901",
     "9010900",
     "9000910",
     "9929990"
    ],
    ["01111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111171111111111111111111111111161111111111111", "11111111171111111111111111111111111161111111111111", "11111111171111111112111115511111111161111111111111", "11177777771111111111111111555551111166666661111111", "11111111111111111151511111111111111111111111111111", "11111111111111111115511111111111111111111111111111", "11111111111111111511111111111111111111111111111111", "11111111111111111511111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111131111121111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111166666611111111111111111", "11111111111111111111111111161111611111111111111111", "11111111111111111111111111169999611111111111111111", "11111111111111111111111111161111611111111111111111", "11111111111111111111111111166666611111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111119111911", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111111111111", "11111111111111111111111111111111111111111119111111"],
    

    ["01802639257529534461843210600017249583251738856491", "65419956156148706610638908874170496747396171221679", "50153535287359450202791469866834775369315139400770", "39838692511254173878538749808125967629385889053398", "80771884114968924894647573764367892691519482883218", "57011821590200226112705135346285721842142540100836", "97234449098418552371446977579657424413516287173691", "70211269249664882792774351871641606214547739708798", "56727219022196293252763898251138077615644451609916", "14957349882003070414253992107267982365000953484216", "14504219167992187655654477458709309777337219114421", "32586321419497479131090179691936283599410928811352", "26712721735588684903065415818486753906009078862078", "06189800284386143538677561002327804393874781194339", "97331061471120460866000422292864812178905834956588", "89141473164289560925451258444854242808761111558255", "79159863938023503356923738131057119542033270306764", "26306303764415475759645515086257851632390597424303", "88825896815087134252396001733958420383428430591628", "75505640662657857842332270154966353738406301465319", "91243246805287658939030669411786186726280094514500", "25880114886710463910272873008569327965439374540104", "15294580975144022554589788138773553655499461118223", "88989418903193967994755766334365935380509556921929", "00465931204946011547582495575525572142004526864429", "02662053915166354392053050506513999224110779964991", "37631638189425375647606473979596663184245119970412", "90073655374440331991016398150574144440116796845499", "53647264831840150855458572656122823252167217239011", "34053787591513978562476936992436521310701198578931", "38068223579176992642666478710914237640696062497514", "52456357988773496967052664059885292044634091441052", "44967194717483742583686905549411116331393279842055", "51099876938056225359777827474554829268094278407285", "55157423533733905593448272908898863072161617449377", "24948419078946120510326102058217539383350517368945", "65578435501701972127542573572416806674299544100097", "11366052328037425436840799759688156164029335089937", "73975352926638710300997754588848399220878981962391", "77355673444755769751745799601790398990070136982725", "48592435567988422929370835069413959306774231676333", "72306620412530937979832458782746174804930451774239", "69682694419688020094896665499925012496182514865824", "65787914460149005996228273544996487256968447818411", "24845304936027059104225020251672848035513898870970", "74930081656821250114895509637340174403946783160912", "88709142964232271690826586264046194665220865792979", "71603964940002702126689556493740684772881976177494", "66719113612173698907067653533084373902122580832563", "08853520459916543781347638419789605852146130377060"],
    ["0410918826", "8269065750", "0979188754", "7633181173", "9833690816", "9741685214", "1726188783", "2997899573", "2868828236", "5715707962"],
    ["0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999", "0000000999"	],
    ["01296289856427627583990950344462777968520299686111", "43022678573840646287258869226707798201798017874000", "99091250801748059146336878382798759607881205562137", "11816984638204727415560787687605639156017897697531", "40661158878887808386818330156139353870554316450915", "87052499187460711490688086746167081362791796225002", "01947863172930252103852068986869791124194119575635", "99375048221224116088159793256443275472445959843964", "11665386993007983373118551550102818759574894279931", "48090805426836021383141239785757526046731211113294", "86931124195333229447180226612761828264433017855583", "43007800221674000083556754623498399774267936433906", "21078141359092519508025805250847051837138333400353", "69814044543738406683645653644949538893806585184212", "33943151758342660866144437241447718020681869707123", "50243078184094857523180809090799328330438402374985", "08566426434568208825612408902362449478270237075064", "71533000131548124383962607058956508620811039545105", "20341652438371053718985796928981187335294991655455", "32591191176597647230235331857688048952376257444637", "16582644947654229541198086173371469690934326060339", "43124097437898104373318455127213940834699361055691", "62109725462158969293897516214824651754684697404632", "41354365968573108227159781544593511305624482527810", "56772548929537378930633648170871233448838613375608", "72932196280118065569902687908277689193692143155132", "36554232324581780762499044939284712416311431013315", "43918362809584311849172602638378407054514114668570", "26606123807258572332229875931079192203431543536195", "04108170620211326072873780115311132179461595475354", "94430952267345272347039904716259706352013871176173", "33286418782466966674782766282825306942997293358752", "23880255384711981372172273791039195381990304632705", "92532741675774493706512349230175416748421110202957", "35004464257114530864401047389205307624260455200898", "17950825896557004718010946951249401962969911683288", "67785299551575462998432452665773214861922053784778", "43774869214514650029563681659442559622835580708379", "17475976964086926143045639786515703547681091892581", "85504670738884583411475863522218063584869461958175", "89296969879850466941406364976282304903284232178276", "61851183935100918229914862281948792834737254946936", "84428201578927374215319915034895892723100107765542", "23452740367308898111237986434700239035719988453296", "27395691783361182628932624730123659384639699682261", "27017054390616715972814318569994425773869622949666", "45724534900418807729724328199044963573348604952485", "57360759001656212967724321892346348019285322384403", "78453823856605885318254243089144862775794590108155", "65543037571824365816297258726224394890459038188189"	]
]
//z.forEach((d,i)=>console.log(stars(d),' result= ',results[i]))
console.log(z.every((d,i)=>results[i]==stars(d))?`TESTS OK FOR 3 PATHS`:'NAH')

