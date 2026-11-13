
export default function Dashboard({ user }) {

    return (
        <main className=" p-4">

            {/* - - - Welcome Section - - - */}
            <div>
                
                <h1>
                    Hello <span>{user?.name}</span>
                </h1>

                <p>
                    Welcome to Build Ledger, your digital ledger for maintaining your construction expenses at your <span>{}</span>.
                </p>
            </div>


            {/* - - - Expense till now - - - */}


            {/* - - - Search bar - - - */}


            {/* - - - Category Cards - - - */}


        </main>
    )
}