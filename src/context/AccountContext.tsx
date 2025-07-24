"use client";
import { fetchOrders, fetchTransactions, fetchNotifications } from "@/lib/helpers";
import { iGroupedOrder, iNotification, iTransaction } from "@/lib/types";
import { logger } from "@sentry/nextjs";
import { AxiosError } from "axios";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";

interface AccountContextType {
	orders: iGroupedOrder[];
	transactions: iTransaction[];
	notifications: iNotification[];
	loadingOrders: boolean;
	loadingTransactions: boolean;
	loadingNotifications: boolean;
	errorOrders: string | null;
	errorTransactions: string | null;
	errorNotifications: string | null;
	fetchOrders: () => Promise<void>;
	fetchTransactions: () => Promise<void>;
	fetchNotifications: () => Promise<void>;
	readNotification: (id: string) => void;
}

export const AccountContext = React.createContext<AccountContextType>({
	orders: [],
	transactions: [],
	notifications: [],
	loadingOrders: false,
	loadingTransactions: false,
	loadingNotifications: false,
	errorOrders: null,
	errorTransactions: null,
	errorNotifications: null,
	fetchOrders: async () => {},
	fetchTransactions: async () => {},
	fetchNotifications: async () => {},
	readNotification: async () => {},
});

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [orders, setOrders] = useState<iGroupedOrder[]>([]);
	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [loadingOrders, setLoadingOrders] = useState(false);
	const [loadingTransactions, setLoadingTransactions] = useState(false);
	const [errorOrders, setErrorOrders] = useState<string | null>(null);
	const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
	const [notifications, setNotifications] = useState<iNotification[]>([]);
	const [errorNotifications, setErrorNotifications] = useState<string | null>(null);
	const [loadingNotifications, setLoadingNotifications] = useState(false);

	const fetchOrdersData = useCallback(async () => {
		setLoadingOrders(true);
		setErrorOrders(null);
		try {
			const data = await fetchOrders({ page: 1, pageSize: 10 });
			setOrders(data.groupedOrders);
		} catch (err) {
			if (err instanceof Error || err instanceof AxiosError) {
				setErrorOrders(err.message);
			} else {
				console.log("Error fetching orders:", { err });
				logger.error("Error fetching orders:", { err });
				setErrorOrders("Failed to fetch orders.");
			}
		} finally {
			setLoadingOrders(false);
		}
	}, []);

	const fetchTransactionsData = useCallback(async () => {
		setLoadingTransactions(true);
		setErrorTransactions(null);
		try {
			const data = await fetchTransactions({ page: 1, pageSize: 10 });
			setTransactions(data.transactions);
		} catch (err) {
			logger.error("Error fetching transactions:", { err });
			if (err instanceof Error || err instanceof AxiosError) {
				setErrorTransactions(err.message);
			} else {
				setErrorTransactions("Failed to fetch transactions.");
			}
		} finally {
			setLoadingTransactions(false);
		}
	}, []);

	const fetchNotificationsData = useCallback(async () => {
		try {
			setLoadingNotifications(true);
			setErrorNotifications(null);

			const res = await fetchNotifications();
			if (res.error) {
				throw new Error(res.error);
			}
			setNotifications(res.notifications);
		} catch (err) {
			logger.error("Error fetching notifications:", { err });
			if (err instanceof Error || err instanceof AxiosError) {
				setErrorNotifications(err.message);
			} else {
				logger.error("Error: Failed to fetch notifications. Please try again later.", {
					text: "OK",
				});

				toast.error("Error: Failed to fetch notifications. Please try again later.");
				setErrorNotifications(
					typeof err === "object" && err !== null && "toString" in err
						? (err as { toString: () => string }).toString()
						: String(err),
				);
			}
		} finally {
			setLoadingNotifications(false);
		}
	}, []);

	const readNotification = useCallback((id: string) => {
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
	}, []);

	useEffect(() => {
		fetchOrdersData();
		fetchTransactionsData();
		fetchNotificationsData();
	}, [fetchOrdersData, fetchTransactionsData, fetchNotificationsData]);

	const contextValue = useMemo(
		() => ({
			orders,
			transactions,
			notifications,
			loadingOrders,
			loadingTransactions,
			loadingNotifications,
			errorOrders,
			errorTransactions,
			errorNotifications,
			fetchOrders: fetchOrdersData,
			fetchTransactions: fetchTransactionsData,
			fetchNotifications: fetchNotificationsData,
			readNotification,
		}),
		[
			orders,
			transactions,
			notifications,
			loadingOrders,
			loadingTransactions,
			loadingNotifications,
			errorOrders,
			errorTransactions,
			errorNotifications,
			fetchOrdersData,
			fetchTransactionsData,
			fetchNotificationsData,
			readNotification,
		],
	);

	return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>;
};
AccountProvider.displayName = "AccountProvider";

export const useAccountContext = () => React.useContext(AccountContext);
