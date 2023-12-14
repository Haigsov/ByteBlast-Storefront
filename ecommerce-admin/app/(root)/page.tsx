import { UserButton } from "@clerk/nextjs";
import exp from "constants";

const SetupPage = () => {
    return (
      <div className="p-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    );
}

export default SetupPage;