// 抽象音频节点

interface Station {
	get IsLimited(): Boolean;	// 是否有限
	get MaxLength(): Number;	// 若有限，最大长度
	get IsOnline(): Boolean;	// 是否在线
};

export default Station;
