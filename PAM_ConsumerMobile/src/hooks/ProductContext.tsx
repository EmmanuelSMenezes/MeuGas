import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from './LocationContext';
import { useOffer } from './OfferContext';
import { useCatalog } from './CatalogContext';
import { useUser } from './UserContext';
import { IProductSearched } from '../interfaces/Offer';
import { Category } from '../interfaces/Category';

interface CategoryHierarchy {
  category_id: string;
  description: string;
  category_parent_id: string | null;
  category_parent_name: string | null;
}

interface Brand {
  partner_id: string;
  branch_id: string;
  branch_name: string;
  avatar?: string;
}

interface ProductContextValues {
  allProducts: IProductSearched[];
  isLoadingProducts: boolean;
  loadProducts: () => Promise<void>;

  // Categorias Pai (Gás, Água, etc)
  getParentCategories: () => CategoryHierarchy[];

  // Subcategorias de uma categoria pai
  getSubcategories: (parentCategoryId: string) => CategoryHierarchy[];

  // Verificar se uma categoria tem filhas
  hasSubcategories: (categoryId: string) => boolean;

  // Marcas que têm produtos em uma subcategoria
  getBrandsBySubcategory: (subcategoryId: string) => Brand[];

  // Produtos filtrados
  getFilteredProducts: (filters: {
    parentCategoryId?: string;
    subcategoryId?: string;
    brandId?: string;
  }) => IProductSearched[];
}

interface ProductProviderProps {
  children: React.ReactNode;
}

const ProductContext = createContext({} as ProductContextValues);

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const { currentLocation } = useLocation();
  const { defaultAddress } = useUser();
  const { getProductsByLocation } = useOffer();
  const { getCategory } = useCatalog();

  const [allProducts, setAllProducts] = useState<IProductSearched[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Usar endereço padrão do usuário se disponível, senão usar localização atual
  const activeLocation = defaultAddress || currentLocation;

  // Buscar todos os produtos disponíveis
  const loadProducts = useCallback(async () => {
    if (!activeLocation?.latitude || !activeLocation?.longitude) {
      console.log('⚠️ Localização não disponível ainda');
      console.log('  - defaultAddress:', defaultAddress);
      console.log('  - currentLocation:', currentLocation);
      return;
    }

    console.log('📍 Usando localização:', {
      source: defaultAddress ? 'defaultAddress' : 'currentLocation',
      latitude: activeLocation.latitude,
      longitude: activeLocation.longitude,
      city: activeLocation.city,
      street: activeLocation.street
    });

    try {
      setIsLoadingProducts(true);
      console.log('📦 Buscando todos os produtos disponíveis...');
      
      const response = await getProductsByLocation(
        10000, // itensPerPage - buscar MUITOS produtos para ter TODAS as categorias
        1,     // page
        '',    // filter
        '',    // category_ids
        '',    // branch_ids
        '',    // ratings
        '',    // distance
        '',    // start_price
        '',    // end_price
        'Asc', // sort_price (TSortOptions = "Asc" | "Desc")
        'Ratings', // orderBy
        false  // shipping
      );

      setAllProducts(response.products || []);
      console.log(`✅ ${response.products?.length || 0} produtos carregados`);

      // Log TODAS as categorias únicas encontradas nos produtos
      if (response.products && response.products.length > 0) {
        const allCategories = new Map<string, any>();
        response.products.forEach(product => {
          product.categories?.forEach(cat => {
            if (!allCategories.has(cat.category_id)) {
              allCategories.set(cat.category_id, {
                id: cat.category_id,
                description: cat.description,
                parent_id: cat.category_parent_id,
                parent_name: cat.category_parent_name
              });
            }
          });
        });
        console.log('📊 TODAS as categorias únicas encontradas:', Array.from(allCategories.values()));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      setAllProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [currentLocation, getProductsByLocation]);

  // Buscar TODAS as categorias do catálogo
  const loadCategories = useCallback(async () => {
    try {
      console.log('📂 Buscando TODAS as categorias do catálogo...');
      const response = await getCategory('', 1, 10000); // Buscar todas as categorias

      if (response?.categories) {
        setAllCategories(response.categories.filter(cat => cat.active));
        console.log(`✅ ${response.categories.length} categorias carregadas`);
        console.log('📊 Categorias:', response.categories.map(cat => ({
          id: cat.category_id,
          description: cat.description,
          parent_id: cat.category_parent_id,
          parent_name: cat.category_parent_name
        })));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error);
      setAllCategories([]);
    }
  }, [getCategory]);

  // Carregar categorias ao iniciar
  useEffect(() => {
    loadCategories();
  }, []);

  // Carregar produtos quando a localização estiver disponível
  useEffect(() => {
    if (activeLocation?.latitude && activeLocation?.longitude) {
      console.log('📍 Localização disponível, carregando produtos...');
      console.log('  - Fonte:', defaultAddress ? 'Endereço padrão do usuário' : 'GPS');
      console.log('  - Latitude:', activeLocation.latitude);
      console.log('  - Longitude:', activeLocation.longitude);
      console.log('  - Cidade:', activeLocation.city);
      loadProducts();
    } else {
      console.log('⏳ Aguardando localização para carregar produtos...');
      console.log('  - defaultAddress disponível?', !!defaultAddress);
      console.log('  - currentLocation disponível?', !!currentLocation);
    }
  }, [activeLocation?.latitude, activeLocation?.longitude, defaultAddress?.address_id, currentLocation?.latitude]);

  // Extrair categorias pai únicas - APENAS as que têm produtos disponíveis
  const getParentCategories = useCallback((): CategoryHierarchy[] => {
    if (!allProducts || allProducts.length === 0) {
      console.log('🔍 getParentCategories - Nenhum produto disponível');
      return [];
    }

    // Extrair TODAS as categorias dos produtos disponíveis
    const categoriesFromProducts = new Map<string, CategoryHierarchy>();

    allProducts.forEach(product => {
      product.categories?.forEach(cat => {
        // Adicionar a categoria atual
        if (!categoriesFromProducts.has(cat.category_id)) {
          categoriesFromProducts.set(cat.category_id, {
            category_id: cat.category_id,
            description: cat.description,
            category_parent_id: cat.category_parent_id,
            category_parent_name: cat.category_parent_name
          });
        }

        // Se tem parent, adicionar o parent também
        if (cat.category_parent_id && cat.category_parent_name) {
          if (!categoriesFromProducts.has(cat.category_parent_id)) {
            categoriesFromProducts.set(cat.category_parent_id, {
              category_id: cat.category_parent_id,
              description: cat.category_parent_name,
              category_parent_id: null,
              category_parent_name: null
            });
          }
        }
      });
    });

    // Filtrar apenas categorias PAI (sem parent_id)
    const parentCategories = Array.from(categoriesFromProducts.values())
      .filter(cat => !cat.category_parent_id);

    // Ordenar: "Gás" sempre primeiro
    const sortedCategories = parentCategories.sort((a, b) => {
      const aIsGas = a.description.toLowerCase().includes('gás') || a.description.toLowerCase().includes('gas');
      const bIsGas = b.description.toLowerCase().includes('gás') || b.description.toLowerCase().includes('gas');

      if (aIsGas && !bIsGas) return -1;
      if (!aIsGas && bIsGas) return 1;
      return 0;
    });

    console.log('📊 Total categorias PAI com produtos:', sortedCategories.length, sortedCategories);
    return sortedCategories;
  }, [allProducts]);

  // Extrair subcategorias de uma categoria pai - APENAS as que têm produtos disponíveis
  const getSubcategories = useCallback((parentCategoryId: string): CategoryHierarchy[] => {
    console.log('🔍 getSubcategories - Buscando filhas de:', parentCategoryId);

    if (!allProducts || allProducts.length === 0) {
      console.log('📊 Total FILHAS encontradas: 0 (sem produtos)');
      return [];
    }

    // Extrair subcategorias dos produtos disponíveis
    const subcategoriesFromProducts = new Map<string, CategoryHierarchy>();

    allProducts.forEach(product => {
      product.categories?.forEach(cat => {
        // Se a categoria tem o parent_id que estamos procurando
        if (cat.category_parent_id === parentCategoryId) {
          if (!subcategoriesFromProducts.has(cat.category_id)) {
            subcategoriesFromProducts.set(cat.category_id, {
              category_id: cat.category_id,
              description: cat.description,
              category_parent_id: cat.category_parent_id,
              category_parent_name: cat.category_parent_name
            });
          }
        }
      });
    });

    const subcategories = Array.from(subcategoriesFromProducts.values());
    console.log('📊 Total FILHAS com produtos:', subcategories.length, subcategories);
    return subcategories;
  }, [allProducts]);

  // Verificar se uma categoria tem filhas com produtos disponíveis
  const hasSubcategories = useCallback((categoryId: string): boolean => {
    if (!allProducts || allProducts.length === 0) {
      return false;
    }

    // Verificar se existe algum produto com categoria filha deste parent
    const hasChildren = allProducts.some(product =>
      product.categories?.some(cat => cat.category_parent_id === categoryId)
    );

    console.log('🔍 hasSubcategories -', categoryId, '→', hasChildren);
    return hasChildren;
  }, [allProducts]);

  // Obter todas as categorias descendentes (filhas, netas, bisnetas, etc.) de uma categoria
  const getAllDescendantCategories = useCallback((categoryId: string): string[] => {
    const descendants: string[] = [categoryId]; // Incluir a própria categoria
    const queue = [categoryId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = allCategories.filter(cat => cat.category_parent_id === currentId);

      children.forEach(child => {
        descendants.push(child.category_id);
        queue.push(child.category_id);
      });
    }

    console.log('🔍 getAllDescendantCategories -', categoryId, '→', descendants.length, 'categorias');
    return descendants;
  }, [allCategories]);

  // Extrair marcas que têm produtos em uma subcategoria (incluindo todas as categorias descendentes)
  const getBrandsBySubcategory = useCallback((subcategoryId: string): Brand[] => {
    console.log('🔍 getBrandsBySubcategory - Buscando marcas para categoria:', subcategoryId);

    // Obter todas as categorias descendentes (incluindo a própria)
    const allDescendants = getAllDescendantCategories(subcategoryId);
    console.log('📂 Buscando produtos nas categorias:', allDescendants);

    const brandsMap = new Map<string, Brand>();

    allProducts.forEach(product => {
      // Verificar se o produto pertence a alguma das categorias descendentes
      const belongsToCategory = product.categories?.some(
        cat => allDescendants.includes(cat.category_id)
      );

      if (belongsToCategory && product.branch_id) {
        const partnerId = product.branch_id; // IProductSearched usa branch_id diretamente

        if (!brandsMap.has(partnerId)) {
          console.log('✅ Adicionando MARCA:', product.branch_name);
          brandsMap.set(partnerId, {
            partner_id: partnerId,
            branch_id: product.branch_id,
            branch_name: product.branch_name,
            avatar: '', // IProductSearched não tem avatar
          });
        }
      }
    });

    const result = Array.from(brandsMap.values());
    console.log('📊 Total MARCAS encontradas:', result.length, result);
    return result;
  }, [allProducts, getAllDescendantCategories]);

  // Filtrar produtos
  const getFilteredProducts = useCallback((filters: {
    parentCategoryId?: string;
    subcategoryId?: string;
    brandId?: string;
  }): IProductSearched[] => {
    console.log('🔍 getFilteredProducts - Filtros:', filters);

    // Se tiver subcategoryId, buscar em todas as categorias descendentes
    let categoryIds: string[] = [];
    if (filters.subcategoryId) {
      categoryIds = getAllDescendantCategories(filters.subcategoryId);
      console.log('📂 Buscando produtos nas categorias:', categoryIds);
    }

    const filtered = allProducts.filter(product => {
      // Filtro por subcategoria (incluindo descendentes)
      if (filters.subcategoryId) {
        const belongsToCategory = product.categories?.some(
          cat => categoryIds.includes(cat.category_id)
        );
        if (!belongsToCategory) return false;
      }

      // Filtro por marca/parceiro (IProductSearched usa branch_id diretamente)
      if (filters.brandId && product.branch_id) {
        if (product.branch_id !== filters.brandId) return false;
      }

      return true;
    });

    console.log('📊 Total produtos filtrados:', filtered.length);
    return filtered;
  }, [allProducts, getAllDescendantCategories]);

  const contextValues: ProductContextValues = {
    allProducts,
    isLoadingProducts,
    loadProducts,
    getParentCategories,
    getSubcategories,
    hasSubcategories,
    getBrandsBySubcategory,
    getFilteredProducts,
  };

  return (
    <ProductContext.Provider value={contextValues}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  return context;
};

