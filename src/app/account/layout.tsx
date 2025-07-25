import { AccountProvider } from "@/context/AccountContext";

const AccountLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <AccountProvider>{children}</AccountProvider>;
};

export default AccountLayout;
