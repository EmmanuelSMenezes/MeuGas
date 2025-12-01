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
import { ProductProvider } from "../ProductContext";
import { SearchFilterProvider } from "../SearchFilterContext";
import { ThemeProvider } from "../themeContext";
import { LocationProvider } from "../LocationContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <GlobalProvider>
      <LocationProvider>
        <CommunicationProvider>
          <UserProvider>
            <AuthProvider>
              <PartnerProvider>
                <CatalogProvider>
                  <OfferProvider>
                    <ProductProvider>
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
                    </ProductProvider>
                  </OfferProvider>
                </CatalogProvider>
              </PartnerProvider>
            </AuthProvider>
          </UserProvider>
        </CommunicationProvider>
      </LocationProvider>
    </GlobalProvider>
  );
};

export default Providers;
