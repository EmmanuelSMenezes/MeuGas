import React from "react";
import { View } from "react-native";
import { AuthProvider } from "../AuthContext";
import { CartProvider } from "../CartContext";
import { UserProvider } from "../UserContext";
import { GlobalProvider } from "../GlobalContext";
import { PartnerProvider } from "../PartnerContext";
import { CatalogProvider } from "../CatalogContext";
import { OrderProvider } from "../OrderContext";
import { ReputationProvider } from "../ReputationContext";
import { CommunicationProvider } from "../CommunicationContext";
import { ChatProvider } from "../ChatContext";
import { StatusProvider } from "../StatusContext";
import { OfferProvider } from "../OfferContext";
import { SearchFilterProvider } from "../SearchFilterContext";
import { ThemeProvider } from "../themeContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <GlobalProvider>
      <CommunicationProvider>
        <UserProvider>
          <AuthProvider>
            <PartnerProvider>
              <CatalogProvider>
                <OfferProvider>
                  <OrderProvider>
                    <StatusProvider>
                      <CartProvider>
                        <SearchFilterProvider>
                          <ReputationProvider>
                            <ChatProvider>
                              <ThemeProvider>{children}</ThemeProvider>
                            </ChatProvider>
                          </ReputationProvider>
                        </SearchFilterProvider>
                      </CartProvider>
                    </StatusProvider>
                  </OrderProvider>
                </OfferProvider>
              </CatalogProvider>
            </PartnerProvider>
          </AuthProvider>
        </UserProvider>
      </CommunicationProvider>
    </GlobalProvider>
  );
};

export default Providers;
