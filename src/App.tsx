import React, { useEffect, useState } from "react";
import "./App.css";
import { useDebounce } from "./hook";

type QQInfo = {
	name: string;
	qlogo: string;
	qq: string;
};

export function isValidQQ(qq: string): boolean {
	return /^[1-9]\d{4,11}$/.test(qq);
}

function App() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [data, setData] = useState<QQInfo | null>(null);
	const [search, setSearch] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value.trim());
	};

	const handleSearch = (value: string) => {
		if (value.length === 0) {
			setLoading(false);
			setData(null);
			setError("");
			return;
		}

		if (!isValidQQ(value)) {
			setData(null);
			setError("请输入正确的QQ号");
			return;
		}

		setError("");
		setLoading(true);
		fetch(`https://api.uomg.com/api/qq.info?qq=${value}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.code !== 1) {
					setError(data.msg);
					setData(null);
				} else {
					setError("");
					setData({
						name: data.name,
						qlogo: data.qlogo,
						qq: data.qq,
					});
				}
			})
			.finally(() => setLoading(false));
	};

	const debouncedSearch = useDebounce(search, 500);

	useEffect(() => {
		handleSearch(debouncedSearch);
	}, [debouncedSearch]);

	return (
		<div className="App">
			<div className="title">QQ号查询</div>
			<input
				className="input"
				type="text"
				placeholder="请输入要查询的QQ号"
				value={search}
				onChange={onChange}
			/>
			<div className="result">
				{loading && <div className="searching">查询中...</div>}
				{!loading && data && (
					<>
						<img
							className="avatar"
							src={data?.qlogo}
							alt="avatar"
						/>
						<div className="info">
							<div title={data?.name} className="name">
								{data?.name}
							</div>
							<div className="qq">{data?.qq}</div>
						</div>
					</>
				)}
				{error && <div className="error">{error}</div>}
			</div>
		</div>
	);
}

export default App;
